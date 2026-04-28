'use strict';

/**
 * Migration: Create Payment Tables
 *
 * STATUS: COMING SOON
 * Modul src/modules/payment/ belum dibuat.
 * Migrasi ini siap dijalankan saat modul Payment tersedia.
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        VARCHAR(100) NOT NULL,
      code        VARCHAR(50) NOT NULL UNIQUE,
      type        VARCHAR(50),
      is_active   INTEGER DEFAULT 1,
      settings    TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_no    VARCHAR(100) NOT NULL UNIQUE,
      user_id         INTEGER,
      method_id       INTEGER,
      amount          DECIMAL(15,2) NOT NULL,
      currency        VARCHAR(10) DEFAULT 'IDR',
      status          VARCHAR(30) DEFAULT 'pending',
      model_type      VARCHAR(100),
      model_id        INTEGER,
      gateway_ref     VARCHAR(255),
      gateway_data    TEXT,
      paid_at         DATETIME,
      expired_at      DATETIME,
      notes           TEXT,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS payment_transactions');
  await db.raw('DROP TABLE IF EXISTS payment_methods');
};
