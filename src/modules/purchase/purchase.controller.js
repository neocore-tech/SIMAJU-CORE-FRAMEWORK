'use strict';

const PurchaseService = require('./purchase.service');
const Response        = require('../../utils/response');

class PurchaseController {
  static async index(req, res) {
    try {
      const data = await PurchaseService.getAll(req.query);
      return Response.success(res, data, 'Purchases fetched successfully');
    } catch (err) { return Response.error(res, err.message); }
  }

  static async store(req, res) {
    try {
      const data = await PurchaseService.create(req.body, req.user?.id);
      return Response.success(res, data, 'Purchase created successfully', 201);
    } catch (err) { return Response.error(res, err.message); }
  }

  static async show(req, res) {
    try {
      const data = await PurchaseService.findById(req.params.id);
      if (!data) return Response.error(res, 'Purchase not found', 404);
      return Response.success(res, data);
    } catch (err) { return Response.error(res, err.message); }
  }

  static async update(req, res) {
    try {
      await PurchaseService.update(req.params.id, req.body);
      return Response.success(res, null, 'Purchase updated successfully');
    } catch (err) { return Response.error(res, err.message); }
  }

  static async destroy(req, res) {
    try {
      await PurchaseService.delete(req.params.id);
      return Response.success(res, null, 'Purchase deleted successfully');
    } catch (err) { return Response.error(res, err.message); }
  }
}

module.exports = PurchaseController;
