'use strict';

/**
 * Migration: Create Tenants Table
 *
 * STATUS: COMING SOON
 * Modul src/modules/tenant/ belum dibuat.
 * tenant.middleware.js sudah ada, tapi CRUD modul tenant belum tersedia.
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS tenants (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        VARCHAR(255) NOT NULL,
      slug        VARCHAR(100) NOT NULL UNIQUE,
      domain      VARCHAR(255),
      plan        VARCHAR(50) DEFAULT 'free',
      status      VARCHAR(20) DEFAULT 'active',
      settings    TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS tenant_users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id  INTEGER NOT NULL,
      user_id    INTEGER NOT NULL,
      role       VARCHAR(50) DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(tenant_id, user_id)
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS tenant_users');
  await db.raw('DROP TABLE IF EXISTS tenants');
};
