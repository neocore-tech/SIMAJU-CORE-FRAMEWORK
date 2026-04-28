'use strict';

/**
 * Database Configuration
 * ─────────────────────────────────────────────────────────────
 * Mirip config/database.php di Laravel.
 * Pilih driver aktif via .env:  DB_CONNECTION=mysql|postgres|sqlite|mongodb
 *
 * Usage:
 *   const dbConfig = require('./src/config/database');
 *   await DB.boot(dbConfig);
 */

require('dotenv').config();

module.exports = {
  /**
   * Nama koneksi default (REKOMENDASI: postgres).
   * Diambil dari env DB_CONNECTION, fallback ke 'postgres'.
   */
  default: process.env.DB_CONNECTION || 'postgres',

  /**
   * Global connection settings
   */
  retry: {
    attempts: 3,
    interval: 2000, // ms
  },

  connections: {
    // ── MySQL ────────────────────────────────────────────────
    mysql: {
      driver: 'mysql',
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_DATABASE || process.env.DB_NAME || 'simaju',
      username: process.env.DB_USERNAME || process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
      charset:  'utf8mb4',
      pool: { 
        min: 2, 
        max: 10, 
        idleTimeoutMillis: 30_000,
        connectionLimit: Number(process.env.DB_POOL_MAX) || 10
      },
    },

    // ── PostgreSQL ───────────────────────────────────────────
    postgres: {
      driver: 'postgres',
      host:     process.env.PG_HOST     || process.env.DB_HOST     || '127.0.0.1',
      port:     Number(process.env.PG_PORT) || Number(process.env.DB_PORT) || 5432,
      database: process.env.PG_NAME     || process.env.DB_DATABASE || 'simaju',
      username: process.env.PG_USER     || process.env.DB_USERNAME || 'postgres',
      password: process.env.PG_PASS     || process.env.DB_PASSWORD || '',
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
      pool: { 
        min: 2, 
        max: Number(process.env.PG_POOL_MAX) || 10, 
        idleTimeoutMillis: 30_000 
      },
    },

    // ── SQLite ───────────────────────────────────────────────
    sqlite: {
      driver: 'sqlite',
      database: process.env.SQLITE_PATH || './database.sqlite',
    },

    // ── MongoDB ──────────────────────────────────────────────
    mongodb: {
      driver:   'mongodb',
      url:      process.env.MONGO_URL   || 'mongodb://localhost:27017',
      database: process.env.MONGO_DB    || 'simaju',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },
  },
};
