module.exports = class Kingdom {

  _points = 0;
  _blazons = [];

  constructor(client) {
    this.client = client;
  }

  async fetch() {
    const { data: kingdom } = await this.client.get('kingdom');
    const { data: blazons } = await this.client.get('kingdom/blazons');

    this._points = kingdom.pointInfos.points;
    this._blazons = blazons.blazons;
  }

  get points() {
    return this._points;
  }

  get blazons() {
    return this._blazons;
  }

};