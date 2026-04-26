'use strict';

const CategoryService = require('./category.service');
const Response = require('../../utils/response');

class CategoryController {
  async index(req, res) {
    const data = await CategoryService.getAll();
    return Response.success(res, data);
  }

  async store(req, res) {
    try {
      const data = await CategoryService.create(req.body);
      return Response.success(res, data, 'Category created', 201);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = new CategoryController();
