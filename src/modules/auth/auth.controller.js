'use strict';

const AuthService = require('./auth.service');
const ApiResponse = require('../../../api/v1/responses/api-response');
const logger = require('../../utils/logger');

/**
 * Auth Controller
 * ─────────────────────────────────────────────────────────────
 * Menjembatani request HTTP dengan service.
 */
class AuthController {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      return ApiResponse.success(res, result, 'User registered successfully', 201);
    } catch (err) {
      logger.error({ err }, '[Auth] Register failed');
      return ApiResponse.fail(res, null, err.message, 400);
    }
  }

  async forgotPassword(req, res) {
    try {
      const result = await AuthService.requestPasswordReset(req.body.email);
      return ApiResponse.success(res, result, 'Password reset link sent successfully');
    } catch (err) {
      logger.error({ err }, '[Auth] Forgot password failed');
      return ApiResponse.fail(res, null, err.message, 400);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
      logger.error({ err }, '[Auth] Login failed');
      return ApiResponse.fail(res, null, err.message, 401);
    }
  }

  async logout(req, res) {
    return ApiResponse.success(res, null, 'Logged out successfully');
  }

  async getMe(req, res) {
    try {
      // req.user is populated by jwt.middleware.js
      return ApiResponse.success(res, req.user, 'User profile retrieved successfully');
    } catch (err) {
      logger.error({ err }, '[Auth] Get Me failed');
      return ApiResponse.error(res, err.message, 500);
    }
  }
}

module.exports = new AuthController();
