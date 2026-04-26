'use strict';

const DB = require('../database');

/**
 * Activity Log Middleware (Bab 8 & 21)
 * ─────────────────────────────────────────────────────────────
 * Mencatat setiap aktivitas perubahan data (POST, PUT, DELETE).
 */
const activityLog = async (req, res, next) => {
  const { method, url, user, body, ip } = req;

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await DB.table('activity_logs').insert({
            user_id: user ? user.id : null,
            activity: `${method} ${url}`,
            payload: JSON.stringify(body),
            ip_address: ip,
            created_at: new Date()
          });
        } catch (err) {
          // Jangan block request jika log gagal
        }
      }
    });
  }
  
  next();
};

module.exports = activityLog;
