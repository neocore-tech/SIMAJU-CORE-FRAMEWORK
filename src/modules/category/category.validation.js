'use strict';

const Response = require('../../utils/response');

class CategoryValidation {
  static create(req, res, next) {
    const { name } = req.body;
    if (!name) return Response.error(res, 'Name is required', 422);
    next();
  }
}

module.exports = CategoryValidation;
