'use strict';

const DB = require('../../database');

class WarehouseService {
  static async getAll() {
    // Example: return await DB.table('warehouses').select('*');
    return []; 
  }

  static async create(data) {
    // Example: return await DB.table('warehouses').insert(data);
    return data;
  }
}

module.exports = WarehouseService;