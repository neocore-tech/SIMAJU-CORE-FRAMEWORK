'use strict';

const rateLimit = require('express-rate-limit');
const Response = require('../utils/response');

/**
 * Advanced Security: Rate Limit (Bab 27)
 * ─────────────────────────────────────────────────────────────
 * Mencegah serangan Brute Force dan DoS.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // limit setiap IP ke 100 request per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return Response.error(res, 'Too many requests, please try again later.', 429);
  }
});

module.exports = apiLimiter;
