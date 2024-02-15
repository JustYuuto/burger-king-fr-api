const axios = require('axios');
const Utils = require('./Utils');
const Captcha = require('./Captcha');
const Kingdom = require('./Kingdom');
const Profile = require('./Profile');
const Orders = require('./Orders');
const Restaurant = require('./Restaurant');
const Lottery = require('./Lottery');
const RequestError = require('./RequestError');

module.exports = class Client {

  /**
   * @type {axios.AxiosInstance}
   */
  axios;
  options;
  bearer;
  kingdom;
  profile;
  orders;
  restaurant;
  lottery;

  constructor(options) {
    if (!options) options = {};
    this.options = options;
    this.axios = axios.create({
      baseURL: Utils.baseApiUrl,
      headers: {
        ...Utils.androidHeaders
      },
      proxy: options.proxy
    });
  }

  async login(email, password) {
    if (email && !password) {
      if (!email.includes('Bearer ')) email = `Bearer ${email}`;
      this.bearer = email;
    } else {
      if (!email || !password) {
        throw new Error('No email or password provided');
      }

      const data = {
        login: email,
        password: password,
        recaptchaToken: await Captcha.resolve(),
        stayLoggedIn: true,
      };

      try {
        const { headers } = await this.axios.post('public/kingdom/login', data);
        this.bearer = headers['authorization'];
      } catch (e) {
        await this.loginWithMfa(data);
      }
    }

    this.kingdom = new Kingdom(this);
    this.profile = new Profile(this);
    this.orders = new Orders(this);
    this.restaurant = new Restaurant(this);
    this.lottery = new Lottery(this);

    await this.profile.fetch();

    const fetchOnStartup = this.options.fetchOnStartup;
    if (fetchOnStartup) {
      if (fetchOnStartup.includes('KINGDOM')) await this.kingdom.fetch();
      if (fetchOnStartup.includes('COUPONS')) await this.kingdom.fetchOffers();
    }
  }

  async loginWithMfa(data) {
    if (!data) throw new Error('No login data provided. Please use Client.login() instead.');
    try {
      const { body } = await this.axios.post('public/kingdom/auth/login-with-mfa', data);
      this.bearer = body.mfaToken;
    } catch (e) {
      console.log(e);
      throw new RequestError('Failed to log in with MFA', e.response.data);
    }
  }

  async sendOtp() {
    try {
      await this.post('public/kingdom/auth/send-otp');
    } catch (e) {
      throw new RequestError('Failed to send OTP', e.response.data);
    }
  }

  async verifyOtp(otp) {
    if (!otp) throw new Error('No OTP provided');
    if (isNaN(parseInt(otp)) || otp.length !== 6) throw new Error('Invalid OTP');
    try {
      const { headers } = await this.post('public/kingdom/auth/verify-otp', { code: otp });
      this.bearer = headers['authorization'];
    } catch (e) {
      throw new RequestError('Failed to verify OTP', e.response.data);
    }
  }

  async createAccount(options) {
    if (!options) options = {};
    if (!options.email) throw new Error('Email is required');
    if (!options.password) throw new Error('Password is required');
    if (!options.birthdate) throw new Error('Birthdate is required');
    if (options.birthdate instanceof Date) options.birthdate = `${
      options.birthdate.getDate() < 10 ? `0${options.birthdate.getDate()}` : options.birthdate.getDate()
    }${
      options.birthdate.getMonth() + 1 < 10 ? `0${options.birthdate.getMonth() + 1}` : options.birthdate.getMonth() + 1
    }${options.birthdate.getFullYear()}`;
    if (typeof options.birthdate === 'string' && options.birthdate.length > 8 || options.birthdate.length < 8)
      throw new Error('Birthdate must be in the format DDMMYYYY');

    try {
      await this.post('public/kingdom/signup', {
        login: options.email,
        password: options.password,
        birthdate: options.birthdate,
        loginType: 'CLASSIC',
        uid: '',
        favRestaurantFrNumber: options.favoriteRestaurant ?? 'K0001',
        optin: options.optIn ?? false,
        student: options.student ?? false,
        recaptchaToken: await Captcha.resolve()
      });
      const self = this;
      return {
        async activate(token) {
          if (!token || !token.startsWith('eyJhb')) throw new Error('Invalid token');
          await self.get(`public/kingdom/activate?token=${token}`);
        }
      };
    } catch (e) {
      console.log(e);
      throw new RequestError('Failed to create account', e.response.data);
    }
  }

  async request(url, method, body, config) {
    if (!url || typeof url !== 'string' || url.trim() === '') throw new Error('An invalid path was provided.');
    if (!(method in axios)) throw new Error('An invalid method was provided.');

    if (method.toLowerCase() === 'get') {
      return await this.axios[method](url, {
        headers: config?.headers ?? {
          Authorization: this.bearer
        },
        ...config
      });
    } else {
      return await this.axios[method](url, body, {
        headers: config?.headers ?? {
          Authorization: this.bearer
        },
        ...config
      });
    }
  }

  async get(url, config) {
    return this.request(url, 'get', null, config);
  }

  async post(url, body, config) {
    return this.request(url, 'post', body, config);
  }

};

module.exports.FetchOnStartup = Object.freeze([
  'COUPONS', 'KINGDOM'
]);
