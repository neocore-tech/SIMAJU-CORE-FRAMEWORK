'use strict';

const ApiResponse = require('../../api/v1/responses/api-response');
const db = require('../../config/database');
const mikrotikService = require('./services/mikrotik.service');
const radiusService = require('./services/radius.service');

const getRouters = async (req, res, next) => {
  try {
    const routers = await db('routers').select('id', 'name', 'ip_address', 'is_active', 'location');
    return res.json(ApiResponse.success(routers, 'Routers retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getPackages = async (req, res, next) => {
  try {
    const packages = await db('billing_packages').select('*');
    return res.json(ApiResponse.success(packages, 'Packages retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getActiveMikrotikUsers = async (req, res, next) => {
  try {
    // For demo purposes, we fetch the first active router
    const router = await db('routers').where({ is_active: true }).first();
    if (!router) {
      return res.status(404).json(ApiResponse.error('No active routers found'));
    }

    const users = await mikrotikService.getActiveUsers(router);
    return res.json(ApiResponse.success(users, 'Active Mikrotik users retrieved'));
  } catch (error) {
    next(error);
  }
};

const createRadiusUser = async (req, res, next) => {
  try {
    const { username, password, packageId } = req.body;

    if (!username || !password || !packageId) {
      return res.status(400).json(ApiResponse.fail('Username, password, and packageId are required'));
    }

    // Get package profile
    const pkg = await db('billing_packages').where({ id: packageId }).first();
    if (!pkg) {
      return res.status(404).json(ApiResponse.fail('Package not found'));
    }

    const result = await radiusService.createUser(username, password, pkg.profile_name);
    return res.status(201).json(ApiResponse.success(result, 'RADIUS user created successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRouters,
  getPackages,
  getActiveMikrotikUsers,
  createRadiusUser
};
