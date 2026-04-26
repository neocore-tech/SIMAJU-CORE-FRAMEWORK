'use strict';

const Response = require('../../utils/response');

class SaleValidation {
  static create(req, res, next) {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.error(res, 'Items are required', 422);
    }
    next();
  }
}

module.exports = SaleValidation;
