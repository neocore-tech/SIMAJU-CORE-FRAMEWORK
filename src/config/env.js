'use strict';

/**
 * Environment Validator
 * ─────────────────────────────────────────────────────────────
 * Validasi env vars saat startup — fail fast dengan pesan error yang jelas.
 * Dipanggil sekali sebelum boot di index.js.
 *
 * Usage:
 *   const { validateEnv } = require('./src/config/env');
 *   validateEnv();  // throws ConfigError jika ada yang kurang
 */

require('dotenv').config();
const { ConfigError } = require('../database/errors');

// ── Rule Definition ────────────────────────────────────────────
// { key, description, required, when }
// `when` = fungsi kondisional — hanya wajib jika kondisi true
const RULES = [
  // App
  { key: 'NODE_ENV', description: 'Application environment (development|production|test)', required: false },
  { key: 'PORT',     description: 'HTTP server port',                                      required: false },

  // DB Driver
  {
    key: 'DB_CONNECTION',
    description: 'Database driver (mysql|postgres|sqlite|mongodb)',
    required: false, // default ke mysql
  },

  // MySQL
  { key: 'DB_HOST', description: 'MySQL host',     required: false, when: () => isDriver('mysql') },
  { key: 'DB_PORT', description: 'MySQL port',     required: false, when: () => isDriver('mysql') },
  { key: 'DB_NAME', description: 'MySQL database', required: true,  when: () => isDriver('mysql') },
  { key: 'DB_USER', description: 'MySQL username', required: true,  when: () => isDriver('mysql') },

  // PostgreSQL
  { key: 'PG_HOST', description: 'PostgreSQL host',     required: false, when: () => isDriver('postgres') },
  { key: 'PG_NAME', description: 'PostgreSQL database', required: true,  when: () => isDriver('postgres') },
  { key: 'PG_USER', description: 'PostgreSQL username', required: true,  when: () => isDriver('postgres') },

  // SQLite
  { key: 'SQLITE_PATH', description: 'SQLite file path', required: false, when: () => isDriver('sqlite') },

  // MongoDB
  { key: 'MONGO_URL', description: 'MongoDB connection URL', required: true, when: () => isDriver('mongodb') },
  { key: 'MONGO_DB',  description: 'MongoDB database name',  required: true, when: () => isDriver('mongodb') },

  // Mail (Bab 7)
  { key: 'MAIL_DRIVER', description: 'Mail driver (smtp|mailgun)', required: false },
  { key: 'MAIL_HOST',   description: 'SMTP host',                 required: false },
  { key: 'MAIL_USER',   description: 'SMTP username',             required: false },
  { key: 'MAIL_PASS',   description: 'SMTP password',             required: false },

  // WhatsApp (Bab 26)
  { key: 'WHATSAPP_API_KEY', description: 'WhatsApp API Key (Wablas/Twilio)', required: false },

  // Telegram (Bab 26)
  { key: 'TELEGRAM_BOT_TOKEN', description: 'Telegram Bot Token', required: false },
];

function isDriver(name) {
  return (process.env.DB_CONNECTION || 'mysql') === name;
}

// ── Validator ──────────────────────────────────────────────────
function validateEnv() {
  const missing = [];

  for (const rule of RULES) {
    if (!rule.required) continue;
    if (rule.when && !rule.when()) continue;
    if (!process.env[rule.key]) {
      missing.push({ key: rule.key, description: rule.description });
    }
  }

  if (missing.length > 0) {
    const lines = missing.map(m => `   - ${m.key.padEnd(20)} → ${m.description}`).join('\n');
    throw new ConfigError(
      `Missing required environment variables:\n${lines}\n\n` +
      `   Copy .env.example → .env and fill in the values.`,
      { missingVars: missing.map(m => m.key) }
    );
  }
}

// ── Typed Getters ──────────────────────────────────────────────
const env = {
  nodeEnv:      process.env.NODE_ENV       || 'development',
  port:         Number(process.env.PORT)   || 3000,
  isProduction: process.env.NODE_ENV       === 'production',
  isDev:        process.env.NODE_ENV       !== 'production',
  logLevel:     process.env.LOG_LEVEL      || 'info',
  slowQueryMs:  Number(process.env.SLOW_QUERY_MS) || 1000,
};

module.exports = { validateEnv, env };
