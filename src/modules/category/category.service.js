'use strict';

const DB = require('../../database');

class CategoryService {
  async getAll() {
    return DB.table('categories').get();
  }

  async create(data) {
    const { name, description } = data;
    const result = await DB.table('categories').insert({
      name,
      description,
      status: 'active',
      created_at: new Date()
    });
    return { id: result.insertId || result._id, name };
  }
}

module.exports = new CategoryService();
