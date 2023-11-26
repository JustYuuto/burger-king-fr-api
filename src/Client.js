const axios = require('axios');
const Utils = require('./Utils');
const Captcha = require('./Captcha');
const Kingdom = require('./Kingdom');
const Profile = require('./Profile');
const Orders = require('./Orders');
const Restaurant = require('./Restaurant');

module.exports = class Client {

  options;
  bearer;
  kingdom;
  profile;
  orders;
  restaurant;

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

    await this.profile.fetch();

    const fetchOnStartup = this.options.fetchOnStartup;
    if (fetchOnStartup.includes('KINGDOM')) await this.kingdom.fetch();
    if (fetchOnStartup.includes('COUPONS')) await this.kingdom.fetchOffers();
  }

  async request(url, method, body) {
    if (!url || typeof url !== 'string' || url.trim() === '') throw new Error('An invalid path was provided.');
    if (!(method in axios)) throw new Error('An invalid method was provided.');

    if (method.toLowerCase() === 'get') {
      return await axios[method](`${Utils.baseApiUrl}${url}`, {
        headers: {
          ...Utils.headers,
          Authorization: this.bearer
        }
      });
    } else {
      return await axios[method](`${Utils.baseApiUrl}${url}`, body, {
        headers: {
          ...Utils.headers,
          Authorization: this.bearer
        }
      });
    }
  }

  async get(url) {
    return this.request(url, 'get');
  }

  async post(url, body) {
    return this.request(url, 'post', body);
  }

};

module.exports.FetchOnStartup = Object.freeze([
  'COUPONS', 'KINGDOM'
]);