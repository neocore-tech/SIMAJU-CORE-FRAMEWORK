'use strict';

const DB = require('../../database');

class ProductService {
  async getAll() {
    return DB.table('products')
      .join('categories', 'products.category_id', '=', 'categories.id')
      .select('products.*', 'categories.name as category_name')
      .get();
  }

  async create(data) {
    const { name, code, category_id, price_buy, price_sell, stock, min_stock, supplier_id } = data;
    
    const result = await DB.table('products').insert({
      name,
      code: code || `PRD-${Date.now()}`,
      category_id,
      price_buy,
      price_sell,
      stock,
      min_stock: min_stock || 0,
      supplier_id,
      created_at: new Date(),
      updated_at: new Date()
    });

    return { id: result.insertId || result._id, name };
  }
}

module.exports = new ProductService();
