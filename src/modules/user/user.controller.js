'use strict';

const UserService = require('./user.service');
const Response = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * User Controller
 * ─────────────────────────────────────────────────────────────
 */
class UserController {
  /**
   * Get Current User Profile
   */
  async getProfile(req, res) {
    try {
      const result = await UserService.getProfile(req.user.id);
      return Response.success(res, result);
    } catch (err) {
      return Response.error(res, err.message, 404);
    }
  }

  /**
   * Update User Profile
   */
  async updateProfile(req, res) {
    try {
      const result = await UserService.updateProfile(req.user.id, req.body);
      return Response.success(res, result, 'Profile updated successfully');
    } catch (err) {
      logger.error({ err }, '[User] Update profile failed');
      return Response.error(res, err.message);
    }
  }

  /**
   * Update KTP Data
   */
  async updateKtp(req, res) {
    try {
      const result = await UserService.updateKtp(req.user.id, req.body);
      return Response.success(res, result, 'KTP data updated successfully');
    } catch (err) {
      logger.error({ err }, '[User] Update KTP failed');
      return Response.error(res, err.message);
    }
  }

  /**
   * Upload Document (Placeholder)
   */
  async uploadDocument(req, res) {
    if (!req.file) {
      return Response.error(res, 'No file uploaded', 400);
    }

    return Response.success(res, {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    }, 'Document uploaded successfully');
  }
}

module.exports = new UserController();
