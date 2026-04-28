'use strict';

/**
 * Migration: Add Role to Users Table
 */
module.exports = {
  up: async (DB) => {
    await DB.raw(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`);
  },

  down: async (DB) => {
    // Note: SQLite doesn't support DROP COLUMN easily, but for Postgres it's fine
    const conn = await DB._resolveConnection(DB.defaultConnection);
    if (conn.driver === 'postgres') {
      await DB.raw(`ALTER TABLE users DROP COLUMN role`);
    }
  }
};
