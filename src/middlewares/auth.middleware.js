'use strict';

const jwt = require('jsonwebtoken');
const Response = require('../utils/response');

/**
 * Auth Middleware
 * ─────────────────────────────────────────────────────────────
 * Melindungi route yang membutuhkan login.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.error(res, 'Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_simaju');
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return Response.error(res, 'Invalid or expired token', 401);
  }
};

module.exports = authMiddleware;
