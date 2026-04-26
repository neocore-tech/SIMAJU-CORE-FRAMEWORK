'use strict';

const WarehouseService = require('./warehouse.service');
const Response = require('../../utils/response');

class WarehouseController {
  static async index(req, res) {
    try {
      const data = await WarehouseService.getAll();
      return Response.success(res, data, 'Data fetched successfully');
    } catch (error) {
      return Response.error(res, error.message);
    }
  }

  static async store(req, res) {
    try {
      const data = await WarehouseService.create(req.body);
      return Response.success(res, data, 'Data created successfully', 201);
    } catch (error) {
      return Response.error(res, error.message);
    }
  }
}

module.exports = WarehouseController;