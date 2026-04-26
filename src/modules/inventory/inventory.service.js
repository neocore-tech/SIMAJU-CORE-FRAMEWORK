'use strict';

const DB = require('../../database');

class InventoryService {
  async trackMovement(productId, type, quantity, reference) {
    await DB.table('stock_movements').insert({
      product_id: productId,
      type, // 'in' or 'out'
      quantity,
      reference, // e.g. 'sale_id', 'purchase_id'
      created_at: new Date()
    });
    return true;
  }

  async getStockHistory(productId) {
    return DB.table('stock_movements')
      .where('product_id', productId)
      .orderBy('created_at', 'DESC')
      .get();
  }
}

module.exports = new InventoryService();
