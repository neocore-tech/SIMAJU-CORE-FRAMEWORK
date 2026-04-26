'use strict';

const SaleService = require('./sale.service');
const Response = require('../../utils/response');

class SaleController {
  async store(req, res) {
    try {
      const result = await SaleService.create(req.user.id, req.body);
      return Response.success(res, result, 'Sale transaction successful', 201);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = new SaleController();
