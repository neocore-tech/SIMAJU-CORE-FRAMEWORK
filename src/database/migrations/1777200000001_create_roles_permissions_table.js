'use strict';

/**
 * Migration: Create Roles & Permissions Tables
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS roles (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      status      VARCHAR(20) DEFAULT 'active',
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS permissions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        VARCHAR(150) NOT NULL UNIQUE,
      description TEXT,
      module      VARCHAR(100),
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      role_id    INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, role_id)
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id       INTEGER NOT NULL,
      permission_id INTEGER NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(role_id, permission_id)
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS role_permissions');
  await db.raw('DROP TABLE IF EXISTS user_roles');
  await db.raw('DROP TABLE IF EXISTS permissions');
  await db.raw('DROP TABLE IF EXISTS roles');
};
