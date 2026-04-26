'use strict';

const DB = require('../../database');

class PurchaseService {
  async create(userId, data) {
    const { supplier_id, items, total_amount } = data;

    return await DB.transaction(async (trx) => {
      const purchaseResult = await trx.table('purchases').insert({
        supplier_id,
        user_id: userId,
        invoice_no: `PUR-${Date.now()}`,
        total_amount,
        created_at: new Date()
      });

      const purchaseId = purchaseResult.insertId || purchaseResult._id;

      for (const item of items) {
        await trx.table('purchase_details').insert({
          purchase_id: purchaseId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        });

        const product = await trx.table('products').where('id', item.product_id).first();
        await trx.table('products').where('id', item.product_id).update({
          stock: (product?.stock || 0) + item.quantity,
          updated_at: new Date()
        });
      }

      return { id: purchaseId };
    });
  }
}

module.exports = new PurchaseService();
