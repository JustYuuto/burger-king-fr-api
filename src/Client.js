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
  }

  async login(email, password) {
    if (email && !password) {
      if (!email.includes('Bearer ')) email = `Bearer ${email}`;
      this.bearer = email;
    } else {
      if (!email || !password) {
        throw new Error('No email or password provided');
      }

      const { headers } = await axios.post(`${Utils.baseApiUrl}public/kingdom/login`, {
        stayLoggedIn: true,
        login: email,
        password: password,
        loginType: 'CLASSIC',
        uid: '',
        recaptchaToken: await Captcha.resolve()
      }, {
        headers: {
          ...Utils.headers,
          Authorization: 'undefined'
        }
      });
      this.bearer = headers['authorization'];
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

  async createAccount(options) {
    if (!options) options = {};
    if (!options.email) throw new Error('Email is required');
    if (!options.password) throw new Error('Password is required');
    if (!options.birthdate) throw new Error('Birthdate is required');
    if (options.birthdate instanceof Date) options.birthdate = `${
      options.birthdate.getDate() < 10 ? `0${options.birthdate.getDate()}` : options.birthdate.getDate()
    }${
      options.birthdate.getMonth() + 1 < 10 ? `0${options.birthdate.getMonth()}` : options.birthdate.getMonth()
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
      throw new RequestError('Failed to create account', e.response.data);
    }
  }

  async request(url, method, body, config) {
    if (!url || typeof url !== 'string' || url.trim() === '') throw new Error('An invalid path was provided.');
    if (!(method in axios)) throw new Error('An invalid method was provided.');

    if (method.toLowerCase() === 'get') {
      return await axios[method](`${Utils.baseApiUrl}${url}`, {
        headers: config?.headers ?? {
          ...Utils.headers,
          Authorization: this.bearer
        },
        proxy: this.options.proxy,
        ...config
      });
    } else {
      return await axios[method](`${Utils.baseApiUrl}${url}`, body, {
        headers: config?.headers ?? {
          ...Utils.headers,
          Authorization: this.bearer
        },
        proxy: this.options.proxy,
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