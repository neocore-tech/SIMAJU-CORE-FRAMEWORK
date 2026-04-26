'use strict';

const DB = require('../../database');

class SupplierService {
  async getAll() {
    return DB.table('suppliers').get();
  }

  async create(data) {
    const { name, address, phone, email } = data;
    const result = await DB.table('suppliers').insert({
      name,
      address,
      phone,
      email,
      created_at: new Date()
    });
    return { id: result.insertId || result._id, name };
  }
}

module.exports = new SupplierService();
