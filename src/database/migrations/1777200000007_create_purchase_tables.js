'use strict';

/**
 * Migration: Create Purchase Tables
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS purchases (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_no  VARCHAR(100) NOT NULL UNIQUE,
      supplier_id   INTEGER,
      total_amount  DECIMAL(15,2) DEFAULT 0,
      status        VARCHAR(30) DEFAULT 'draft',
      notes         TEXT,
      purchased_at  DATETIME,
      created_by    INTEGER,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS purchase_items (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id   INTEGER NOT NULL,
      product_id    INTEGER,
      product_name  VARCHAR(255),
      quantity      DECIMAL(10,2) DEFAULT 0,
      unit_price    DECIMAL(15,2) DEFAULT 0,
      total_price   DECIMAL(15,2) DEFAULT 0,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS purchase_items');
  await db.raw('DROP TABLE IF EXISTS purchases');
};
