'use strict';

const ProductService = require('./product.service');
const Response = require('../../utils/response');

class ProductController {
  async index(req, res) {
    const data = await ProductService.getAll();
    return Response.success(res, data);
  }

  async store(req, res) {
    try {
      const data = await ProductService.create(req.body);
      return Response.success(res, data, 'Product created', 201);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = new ProductController();
