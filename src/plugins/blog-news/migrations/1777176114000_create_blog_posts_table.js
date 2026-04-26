'use strict';

/**
 * Migration: Create Blog Posts Table
 */
module.exports = {
  up: async (DB) => {
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        author TEXT DEFAULT 'Admin',
        category TEXT DEFAULT 'General',
        status TEXT DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  down: async (DB) => {
    await DB.raw('DROP TABLE IF EXISTS blog_posts');
  }
};
