'use strict';

const SupplierService = require('./supplier.service');
const Response = require('../../utils/response');

class SupplierController {
  async index(req, res) {
    const data = await SupplierService.getAll();
    return Response.success(res, data);
  }

  async store(req, res) {
    try {
      const data = await SupplierService.create(req.body);
      return Response.success(res, data, 'Supplier created', 201);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = new SupplierController();
