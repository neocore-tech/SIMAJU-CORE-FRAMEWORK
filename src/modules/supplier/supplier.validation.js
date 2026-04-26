'use strict';

const Response = require('../../utils/response');

class SupplierValidation {
  static create(req, res, next) {
    const { name, phone } = req.body;
    if (!name) return Response.error(res, 'Name is required', 422);
    if (!phone) return Response.error(res, 'Phone is required', 422);
    next();
  }
}

module.exports = SupplierValidation;
