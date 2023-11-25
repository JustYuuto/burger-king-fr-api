const Captcha = require('./Captcha');

module.exports = class Orders {

  constructor(client) {
    this.client = client;
  }

  async fetch(days = 1, limited = true) {
    const { data } = await this.client.get(`public/orders?days=${days}&isLimited=${limited}`);
    return data;
  }

  async addCouponCode(code) {
    await this.client.get(`public/orders/coupon-code?code=${code}&pickUpType=&queen=${await Captcha.resolve()}`);
  }

};