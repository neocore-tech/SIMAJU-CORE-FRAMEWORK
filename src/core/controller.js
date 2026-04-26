'use strict';

const Response = require('../utils/response');

/**
 * Base Controller (Bab 11)
 * ─────────────────────────────────────────────────────────────
 * Menyediakan helper response agar controller module lebih bersih.
 */
class Controller {
  success(res, data, message, code) {
    return Response.success(res, data, message, code);
  }

  error(res, message, code, errors) {
    return Response.error(res, message, code, errors);
  }

  // Helper untuk validasi input standar jika diperlukan
  validate(req, schema) {
    // Implementasi validasi schema global di sini
  }
}

module.exports = Controller;
