module.exports = class OrderItem {

  fromMenu(menu) {
    this.id = menu.id;
    this.label = menu.name;
    this.originalPrice = menu.price;

    return this;
  }

  addItem(item, options) {
    if (!options) options = {};
    const obj = {
      id: item.id,
      label: item.name,
      freeItems: item.freeItems ?? [],
      recipe: item.recipe ?? [],
      quantity: options.quantity ?? 1,
      originalPrice: item.price ?? 0
    };
    if (typeof options.noIce === 'boolean') obj.noIce = options.noIce;
    if (typeof options.pickUpLater === 'boolean') obj.pickUpLater = options.pickUpLater;
    Object.assign(this, obj);

    return this;
  }

  addSubItem(item, options) {
    if (!this.subContent) this.subContent = [];
    if (!options) options = {};
    const obj = {
      id: item.id,
      label: item.name,
      freeItems: item.freeItems ?? [],
      recipe: item.recipe ?? [],
      quantity: options.quantity ?? 1,
      originalPrice: item.price ?? 0
    };
    if (typeof options.noIce === 'boolean') obj.noIce = options.noIce;
    if (typeof options.pickUpLater === 'boolean') obj.pickUpLater = options.pickUpLater;
    this.subContent.push(obj);

    return this;
  }

  applyPromotion(promotion, client) {
    if (!client) throw new Error('Client must be set in the constructor in order to use OrderItem.applyPromotion().');
    if (!this.promotions) this.promotions = [];
    if (!client.kingdom) throw new Error('"KINGDOM" must be added to the "fetchOnStartup" array in the client constructor.');
    if (!client.kingdom.coupons) throw new Error('"COUPONS" must be added to the "fetchOnStartup" array in the client constructor.');

    const obj = {
      couponCode: client.kingdom.coupons[0]?.id,
      promotionId: promotion.id,
      promotionName: promotion.name,
      promoType: promotion.promoType,
      promoValue: promotion.promoValue,
      idReboot: promotion.idReboot,
      threshold: promotion.threshold,
    };
    this.promotions.push(obj);

    return this;
  }

};