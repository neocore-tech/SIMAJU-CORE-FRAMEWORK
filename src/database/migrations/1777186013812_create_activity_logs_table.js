'use strict';

const DB = require('../index');

module.exports = {
  up: async () => {
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NULL,
        activity TEXT NOT NULL,
        payload TEXT NULL,
        ip_address TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  down: async () => {
    await DB.raw(`DROP TABLE IF EXISTS activity_logs`);
  }
};
