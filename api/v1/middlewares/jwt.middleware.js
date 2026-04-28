'use strict';

const jwt = require('jsonwebtoken');
const ApiResponse = require('../responses/api-response');

/**
 * JWT Authentication Middleware
 * ─────────────────────────────────────────────────────────────
 * Memastikan request memiliki token JWT yang valid di header Authorization.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return ApiResponse.fail(res, null, 'Access Denied: No Token Provided', 401);
  }

  const secret = process.env.JWT_SECRET || 'simaju-super-secret-key';

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return ApiResponse.fail(res, null, 'Invalid or Expired Token', 403);
    }
    
    // Simpan data user ke dalam request
    req.user = user;
    next();
  });
};
