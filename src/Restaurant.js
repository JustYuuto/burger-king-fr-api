module.exports = class Restaurant {

  constructor(client) {
    this.client = client;
  }

  async fetch(id) {
    const { data } = await this.client.get(`public/restaurant/${id}`);
    const client = this.client;
    Object.assign(data, {
      async quota() {
        return (await client.get(`public/restaurant/${id}/quota?frNumber=${id}`)).data;
      }
    });
    return data;
  }

};