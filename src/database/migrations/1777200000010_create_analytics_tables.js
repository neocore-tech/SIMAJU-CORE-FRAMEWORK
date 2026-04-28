'use strict';

/**
 * Migration: Create Analytics Tables
 *
 * STATUS: COMING SOON
 * Modul src/modules/analytics/ belum dibuat.
 * Migrasi ini siap dijalankan saat modul Analytics tersedia.
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS analytics_sessions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  VARCHAR(100) NOT NULL UNIQUE,
      user_id     INTEGER,
      ip_address  VARCHAR(45),
      user_agent  TEXT,
      started_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at    DATETIME
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  VARCHAR(100),
      user_id     INTEGER,
      event       VARCHAR(100) NOT NULL,
      path        VARCHAR(500),
      properties  TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS analytics_events');
  await db.raw('DROP TABLE IF EXISTS analytics_sessions');
};
