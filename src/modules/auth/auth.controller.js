'use strict';

const AuthService = require('./auth.service');
const Response = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * Auth Controller
 * ─────────────────────────────────────────────────────────────
 * Menjembatani request HTTP dengan service.
 */
class AuthController {
  /**
   * Handle Register
   */
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      return Response.success(res, result, 'User registered successfully', 201);
    } catch (err) {
      logger.error({ err }, '[Auth] Register failed');
      return Response.error(res, err.message, 400);
    }
  }

  /**
   * Handle Forgot Password
   */
  async forgotPassword(req, res) {
    try {
      const result = await AuthService.requestPasswordReset(req.body.email);
      return Response.success(res, result, 'Password reset link sent successfully');
    } catch (err) {
      logger.error({ err }, '[Auth] Forgot password failed');
      return Response.error(res, err.message, 400);
    }
  }

  /**
   * Handle Login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return Response.success(res, result, 'Login successful');
    } catch (err) {
      logger.error({ err }, '[Auth] Login failed');
      return Response.error(res, err.message, 401);
    }
  }

  /**
   * Handle Logout
   */
  async logout(req, res) {
    // Logic logout (client-side biasanya hapus token)
    return Response.success(res, null, 'Logged out successfully');
  }
}

module.exports = new AuthController();
