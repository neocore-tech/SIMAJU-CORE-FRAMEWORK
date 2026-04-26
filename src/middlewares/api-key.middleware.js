'use strict';

const DB = require('../database');
const Response = require('../utils/response');

/**
 * API Key Middleware (Bab 19)
 * ─────────────────────────────────────────────────────────────
 * Validasi request menggunakan API Key untuk integrasi external.
 */
const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(); // Lanjut jika tidak ada, nanti akan kena AuthMiddleware jika diperlukan
  }

  try {
    const keyData = await DB.table('api_keys').where('key', apiKey).where('status', 'active').first();
    
    if (!keyData) {
      return Response.error(res, 'Invalid API Key', 401);
    }

    req.apiKeyData = keyData;
    next();
  } catch (err) {
    next();
  }
};

module.exports = apiKeyAuth;
