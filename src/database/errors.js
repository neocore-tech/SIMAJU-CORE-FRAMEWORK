'use strict';

/**
 * Database Error Hierarchy
 * ─────────────────────────────────────────────────────────────
 * Semua error database extend DatabaseError sehingga mudah di-catch:
 *
 *   try { ... }
 *   catch (err) {
 *     if (err instanceof ConnectionError) { ... }
 *     if (err instanceof QueryError)      { ... }
 *   }
 */

// ── Base ──────────────────────────────────────────────────────
class DatabaseError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name    = this.constructor.name;
    this.driver  = options.driver  || null;
    this.code    = options.code    || 'DATABASE_ERROR';
    this.context = options.context || {};
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Connection ────────────────────────────────────────────────
class ConnectionError extends DatabaseError {
  constructor(message, options = {}) {
    super(message, { ...options, code: 'CONNECTION_ERROR' });
  }
}

// ── Query ─────────────────────────────────────────────────────
class QueryError extends DatabaseError {
  constructor(message, options = {}) {
    super(message, { ...options, code: 'QUERY_ERROR' });
    this.sql      = options.sql      || null;
    this.bindings = options.bindings || [];
  }
}

// ── Transaction ───────────────────────────────────────────────
class TransactionError extends DatabaseError {
  constructor(message, options = {}) {
    super(message, { ...options, code: 'TRANSACTION_ERROR' });
  }
}

// ── Config ────────────────────────────────────────────────────
class ConfigError extends DatabaseError {
  constructor(message, options = {}) {
    super(message, { ...options, code: 'CONFIG_ERROR' });
    this.missingVars = options.missingVars || [];
  }
}

module.exports = {
  DatabaseError,
  ConnectionError,
  QueryError,
  TransactionError,
  ConfigError,
};
