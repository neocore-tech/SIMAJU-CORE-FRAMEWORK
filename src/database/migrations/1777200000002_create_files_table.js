'use strict';

/**
 * Migration: Create Files Table
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS files (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      original_name VARCHAR(255) NOT NULL,
      filename     VARCHAR(255) NOT NULL,
      mimetype     VARCHAR(100),
      size         INTEGER,
      path         VARCHAR(500) NOT NULL,
      url          VARCHAR(500),
      disk         VARCHAR(50) DEFAULT 'local',
      uploaded_by  INTEGER,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS files');
};
