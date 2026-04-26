'use strict';

const Response = require('../../utils/response');

/**
 * Auth Validation (Bab 11 & 31)
 * ─────────────────────────────────────────────────────────────
 * Menangani validasi input sebelum diproses oleh service.
 */
class AuthValidation {
  static login(req, res, next) {
    const { email, password } = req.body;
    const errors = {};

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      return Response.error(res, 'Validation Error', 422, errors);
    }

    next();
  }

  static register(req, res, next) {
    const { nama_lengkap, email, password, konfirmasi_password } = req.body;
    const errors = {};

    if (!nama_lengkap) errors.nama_lengkap = 'Full name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password !== konfirmasi_password) errors.konfirmasi_password = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      return Response.error(res, 'Validation Error', 422, errors);
    }

    next();
  }
}

module.exports = AuthValidation;
