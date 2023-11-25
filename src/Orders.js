const Captcha = require('./Captcha');
module.exports = class Orders {

  _points = 0;
  _blazons = [];

  constructor(client) {
    this.client = client;
  }

  async fetch() {
  }

  async addCouponCode(code) {
    await this.client.get(`public/orders/coupon-code?code=${code}&pickUpType=&queen=${await Captcha.resolve()}`);
  }

  get points() {
    return this._points;
  }

  get blazons() {
    return this._blazons;
  }

};