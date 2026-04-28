'use strict';

/**
 * Migration: Create Workflow Tables
 *
 * STATUS: COMING SOON
 * Modul src/modules/workflow/ belum dibuat.
 * Migrasi ini siap dijalankan saat modul Workflow tersedia.
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS workflows (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        VARCHAR(255) NOT NULL,
      description TEXT,
      model_type  VARCHAR(100),
      is_active   INTEGER DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS workflow_steps (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id   INTEGER NOT NULL,
      name          VARCHAR(255) NOT NULL,
      type          VARCHAR(50) DEFAULT 'approval',
      order_index   INTEGER DEFAULT 0,
      assignee_role VARCHAR(100),
      assignee_id   INTEGER,
      config        TEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS workflow_instances (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id   INTEGER NOT NULL,
      model_type    VARCHAR(100),
      model_id      INTEGER,
      current_step  INTEGER DEFAULT 0,
      status        VARCHAR(30) DEFAULT 'pending',
      initiated_by  INTEGER,
      completed_at  DATETIME,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS workflow_instances');
  await db.raw('DROP TABLE IF EXISTS workflow_steps');
  await db.raw('DROP TABLE IF EXISTS workflows');
};
