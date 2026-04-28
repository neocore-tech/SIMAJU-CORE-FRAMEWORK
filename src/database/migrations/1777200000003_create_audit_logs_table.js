'use strict';

/**
 * Migration: Create Audit Logs Table
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER,
      action      VARCHAR(100) NOT NULL,
      model_type  VARCHAR(100),
      model_id    INTEGER,
      old_values  TEXT,
      new_values  TEXT,
      ip_address  VARCHAR(45),
      user_agent  TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS audit_logs');
};
