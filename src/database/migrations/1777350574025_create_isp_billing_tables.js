'use strict';

module.exports = {
  up: async (db) => {
    // 1. Mikrotik Routers
    await db.schema.createTable('routers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('ip_address').notNullable();
      table.string('api_user').notNullable();
      table.string('api_password').notNullable();
      table.integer('api_port').defaultTo(8728);
      table.boolean('is_active').defaultTo(true);
      table.string('location');
      table.timestamps(true, true);
    });

    // 2. Billing Packages (Internet Plans)
    await db.schema.createTable('billing_packages', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable(); // e.g. "10 Mbps Home"
      table.string('profile_name').notNullable(); // Mikrotik profile name
      table.decimal('price', 15, 2).notNullable();
      table.string('bandwidth_limit'); // e.g. "10M/10M"
      table.integer('duration_days').defaultTo(30);
      table.timestamps(true, true);
    });

    // 3. FreeRADIUS Tables (Standard Schema)
    await db.schema.createTable('radcheck', (table) => {
      table.increments('id').primary();
      table.string('username', 64).notNullable().defaultTo('');
      table.string('attribute', 64).notNullable().defaultTo('');
      table.string('op', 2).notNullable().defaultTo('==');
      table.string('value', 253).notNullable().defaultTo('');
      // Indexes
      table.index(['username']);
    });

    await db.schema.createTable('radreply', (table) => {
      table.increments('id').primary();
      table.string('username', 64).notNullable().defaultTo('');
      table.string('attribute', 64).notNullable().defaultTo('');
      table.string('op', 2).notNullable().defaultTo('=');
      table.string('value', 253).notNullable().defaultTo('');
      table.index(['username']);
    });

    await db.schema.createTable('radacct', (table) => {
      table.bigIncrements('radacctid').primary();
      table.string('acctsessionid', 64).notNullable().defaultTo('');
      table.string('acctuniqueid', 32).notNullable().defaultTo('');
      table.string('username', 64).notNullable().defaultTo('');
      table.string('nasipaddress', 15).notNullable().defaultTo('');
      table.string('nasportid', 32).notNullable().defaultTo('');
      table.string('nasporttype', 32).notNullable().defaultTo('');
      table.dateTime('acctstarttime').nullable();
      table.dateTime('acctupdatetime').nullable();
      table.dateTime('acctstoptime').nullable();
      table.integer('acctinterval').nullable();
      table.integer('acctsessiontime').nullable();
      table.string('acctauthentic', 32).notNullable().defaultTo('');
      table.string('connectinfo_start', 128).nullable();
      table.string('connectinfo_stop', 128).nullable();
      table.bigInteger('acctinputoctets').nullable();
      table.bigInteger('acctoutputoctets').nullable();
      table.string('calledstationid', 50).notNullable().defaultTo('');
      table.string('callingstationid', 50).notNullable().defaultTo('');
      table.string('acctterminatecause', 32).notNullable().defaultTo('');
      table.string('servicetype', 32).notNullable().defaultTo('');
      table.string('framedprotocol', 32).notNullable().defaultTo('');
      table.string('framedipaddress', 15).notNullable().defaultTo('');
      
      table.index(['username']);
      table.index(['acctsessionid']);
      table.index(['acctuniqueid']);
      table.index(['acctstarttime']);
      table.index(['acctstoptime']);
      table.index(['nasipaddress']);
    });
  },

  down: async (db) => {
    await db.schema.dropTableIfExists('radacct');
    await db.schema.dropTableIfExists('radreply');
    await db.schema.dropTableIfExists('radcheck');
    await db.schema.dropTableIfExists('billing_packages');
    await db.schema.dropTableIfExists('routers');
  }
};
