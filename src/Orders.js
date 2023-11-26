const Captcha = require('./Captcha');
const RequestError = require('./RequestError');

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

  async create(details) {
    if (!details) details = {};
    if (!details.pickUpType) throw new Error('Pick up type is required.');
    if (!details.restaurantId) throw new Error('Restaurant id is required.');
    if (!details.items || details.items.length < 1) throw new Error('At least one item to order is required.');

    const items = details.items.map(item => {
      if (!item.quantity) item.quantity = 1;
      if (item.subContent) {
        for (const content of item.subContent) {
          if (!content.freeItems) content.freeItems = [];
          if (!content.recipe) content.recipe = [];
          content.airshipTagInApp = '';
        }
      }
      if (item.promotions && item.promotions.length > 0) {
        for (const promotion of item.promotions) {
          if (promotion.promoType === 'ITEM_VALUE_FIXED') {
            item.finalPrice = promotion.promoValue;
          }
        }
      }
      if (typeof item.finalPrice === 'undefined') item.finalPrice = item.originalPrice;
      item.airshipTagInApp = '';
      return item;
    });
    const order = {
      clientId: this.client.profile.loyaltyCardCode,
      clientFirstname: this.client.profile.firstName,
      clientEmail: this.client.profile.email,
      clientTelephone: this.client.profile.phone,
      pickUpType: details.pickUpType,
      frNumber: details.restaurantId,
      originalPrice: items.map(item => item.originalPrice).reduce((a, b) => a + b),
      finalPrice: items.map(item => item.finalPrice).reduce((a, b) => a + b),
      earnedPoints: Math.floor(items.map(item => item.finalPrice ?? item.originalPrice).reduce((a, b) => a + b) * 2),
      content: items,
      promotions: []
    };

    const data = {
      deviceCheckPayload: {
        queen: await Captcha.resolve()
      },
      workflowNotConnected: false,
      order
    };
    try {
      await this.client.post('public/orders?licensePlateEnrolment=0', data);
    } catch (e) {
      throw new RequestError('Failed to create the order!', e.response.data);
    }
  }

};

module.exports.PickUpType = Object.freeze({
  PickUp: 'PICK_UP',
  OnSite: 'ON_SITE'
});