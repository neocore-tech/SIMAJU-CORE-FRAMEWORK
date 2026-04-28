'use strict';

/**
 * Migration: Create CMS Tables
 *
 * STATUS: COMING SOON
 * Modul src/modules/cms/ belum dibuat.
 * Migrasi ini siap dijalankan saat modul CMS tersedia.
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS cms_categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        VARCHAR(255) NOT NULL,
      slug        VARCHAR(255) NOT NULL UNIQUE,
      parent_id   INTEGER DEFAULT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS cms_posts (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        VARCHAR(500) NOT NULL,
      slug         VARCHAR(500) NOT NULL UNIQUE,
      content      TEXT,
      excerpt      TEXT,
      type         VARCHAR(50) DEFAULT 'post',
      status       VARCHAR(20) DEFAULT 'draft',
      author_id    INTEGER,
      category_id  INTEGER,
      thumbnail    VARCHAR(500),
      published_at DATETIME,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS cms_pages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       VARCHAR(500) NOT NULL,
      slug        VARCHAR(500) NOT NULL UNIQUE,
      content     TEXT,
      status      VARCHAR(20) DEFAULT 'draft',
      author_id   INTEGER,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS cms_pages');
  await db.raw('DROP TABLE IF EXISTS cms_posts');
  await db.raw('DROP TABLE IF EXISTS cms_categories');
};
