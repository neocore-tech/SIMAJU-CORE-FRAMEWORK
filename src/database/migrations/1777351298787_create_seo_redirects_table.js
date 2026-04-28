'use strict';

module.exports = {
  up: async (db) => {
    await db.schema.createTable('seo_redirects', (table) => {
      table.increments('id').primary();
      table.string('old_url').notNullable().unique();
      table.string('new_url').notNullable();
      table.integer('status_code').defaultTo(301); // 301 Permanent, 302 Temporary
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
  },

  down: async (db) => {
    await db.schema.dropTableIfExists('seo_redirects');
  }
};
