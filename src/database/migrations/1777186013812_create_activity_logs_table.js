'use strict';

const DB = require('../index');

module.exports = {
  up: async (DB) => {
    const conn = await DB._resolveConnection(DB.defaultConnection);
    const driver = conn.driver;
    const pk = driver === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const dt = driver === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

    await DB.raw(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id ${pk},
        user_id INTEGER NULL,
        activity TEXT NOT NULL,
        payload TEXT NULL,
        ip_address TEXT NULL,
        created_at ${dt} DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  down: async () => {
    await DB.raw(`DROP TABLE IF EXISTS activity_logs`);
  }
};
