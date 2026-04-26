'use strict';

const Response = require('../../utils/response');

class ProductValidation {
  static create(req, res, next) {
    const { name, category_id, price_sell, stock } = req.body;
    const errors = {};

    if (!name) errors.name = 'Name is required';
    if (!category_id) errors.category_id = 'Category is required';
    if (!price_sell) errors.price_sell = 'Selling price is required';
    if (stock === undefined) errors.stock = 'Stock is required';

    if (Object.keys(errors).length > 0) {
      return Response.error(res, 'Validation Error', 422, errors);
    }
    next();
  }
}

module.exports = ProductValidation;
