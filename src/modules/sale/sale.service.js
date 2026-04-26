'use strict';

const DB = require('../../database');

class SaleService {
  async create(userId, data) {
    const { items, total_amount, discount = 0, tax = 0 } = data;

    // Gunakan Transaction
    return await DB.transaction(async (trx) => {
      // 1. Simpan Header Penjualan
      const saleResult = await trx.table('sales').insert({
        user_id: userId,
        invoice_no: `INV-${Date.now()}`,
        total_amount,
        discount,
        tax,
        final_amount: total_amount - discount + tax,
        created_at: new Date()
      });

      const saleId = saleResult.insertId || saleResult._id;

      // 2. Simpan Detail & Update Stok
      for (const item of items) {
        // Simpan Detail
        await trx.table('sale_details').insert({
          sale_id: saleId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        });

        // Update Stok
        const product = await trx.table('products').where('id', item.product_id).first();
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.product_id}`);
        }

        await trx.table('products').where('id', item.product_id).update({
          stock: product.stock - item.quantity,
          updated_at: new Date()
        });
      }

      return { id: saleId };
    });
  }
}

module.exports = new SaleService();
