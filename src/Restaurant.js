const axios = require('axios');
const Utils = require('./Utils');

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
      },
      async catalog() {
        const { data: catalog } = await axios.get(`https://ecoceabkstorageprdnorth.blob.core.windows.net/catalog/catalog.${id}.json`, {
          headers: Utils.headers
        });

        return {
          ...catalog,
          getCategory: (id) => catalog.categories.find(category => category.id === id),
          getSubCategory: (id) => catalog.subCategories.find(sub => sub.id === id),
          getProductGroup: (id) => catalog.productGroups.find(group => group.id === id),
          getProduct: (id) => catalog.products.find(product => product.id === id),
          getMenu: (id) => catalog.menus.find(menu => menu.id === id),
          getIngredient: (id) => catalog.ingredients.find(ingredient => ingredient.id === id),
          getAllergen: (id) => catalog.allergens.find(allergen => allergen.id === id),
          getPromotion: (id) => catalog.promotions.find(promotion => promotion.id === id),
          getGame: (id) => catalog.games.find(game => game.id === id),
        };
      }
    });
    return data;
  }

};