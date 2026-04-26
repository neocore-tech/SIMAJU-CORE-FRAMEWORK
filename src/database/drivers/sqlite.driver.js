const Connection = require('../connection');
const { QueryError } = require('../errors');
const logger = require('../../utils/logger');

/**
 * SQLite Driver
 * Library: better-sqlite3 (synchronous API)
 * Note: query() tetap async agar interface seragam dengan driver lain.
 */
class SQLiteDriver extends Connection {
  constructor(config) {
    super(config);
  }

  async connect() {
    try {
      const Database = require('better-sqlite3');
      this._client = new Database(this.config.database);
      // Enable WAL mode untuk performa lebih baik
      this._client.pragma('journal_mode = WAL');
      logger.info(`✅ [SQLite] Connected → "${this.config.database}"`);
    } catch (err) {
      throw new Error(`[SQLite] Connection failed: ${err.message}`);
    }
  }

  async disconnect() {
    if (this._client) {
      this._client.close();
      this._client = null;
      logger.info('🔌 [SQLite] Disconnected');
    }
  }

  async query(sql, bindings = []) {
    try {
      const stmt  = this._client.prepare(sql);
      const upper = sql.trim().toUpperCase();

      if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
        return stmt.all(...bindings);
      }
      return stmt.run(...bindings);
    } catch (err) {
      throw new QueryError(`[SQLite] Query failed: ${err.message}`, { 
        driver: 'sqlite', 
        sql, 
        bindings 
      });
    }
  }

  async ping() {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (err) {
      return false;
    }
  }

  // ── Transaction Support ─────────────────────────────────────
  async beginTransaction() {
    // better-sqlite3 does not support async transactions via SQL BEGIN easily for this architecture
    // we return the client itself as the "connection" object
    this._client.prepare('BEGIN').run();
    return this._client;
  }

  async commit(client) {
    client.prepare('COMMIT').run();
  }

  async rollback(client) {
    client.prepare('ROLLBACK').run();
  }
}

module.exports = SQLiteDriver;
