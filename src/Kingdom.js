module.exports = class Kingdom {

  _points = 0;
  _blazons = [];
  _coupons = [];

  constructor(client) {
    this.client = client;
  }

  async fetch() {
    const { data: kingdom } = await this.client.get('kingdom');
    const { data: blazons } = await this.client.get('kingdom/blazons');

    this._code = kingdom.kingdomAuthCode;
    this._points = kingdom.pointInfos.points;
    this._blazons = blazons.blazons;
  }

  async fetchOffers() {
    const { data: offers } = await this.client.get('kingdom/offers');

    this._coupons = offers.coupons;
  }

  get points() {
    return this._points;
  }

  get blazons() {
    return this._blazons;
  }

  get coupons() {
    return this._coupons;
  }

  get code() {
    return this._code;
  }

};