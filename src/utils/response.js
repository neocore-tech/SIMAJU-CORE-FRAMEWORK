'use strict';

/**
 * Standard API Response Utility
 * ─────────────────────────────────────────────────────────────
 * Menjamin format output seragam di seluruh aplikasi (Bab 11).
 */
class Response {
  /**
   * @param {import('express').Response} res
   * @param {any} data
   * @param {string} message
   * @param {number} code
   */
  static success(res, data = null, message = 'Success', code = 200) {
    return res.status(code).json({
      status: 'success',
      message,
      data
    });
  }

  /**
   * @param {import('express').Response} res
   * @param {string} message
   * @param {number} code
   * @param {any} errors
   */
  static error(res, message = 'Error', code = 500, errors = null) {
    return res.status(code).json({
      status: 'error',
      message,
      errors
    });
  }
}

module.exports = Response;
