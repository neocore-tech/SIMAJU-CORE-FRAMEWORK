const Connection = require('../connection');
const { ConnectionError, QueryError, TransactionError } = require('../errors');
const logger = require('../../utils/logger');

/**
 * PostgreSQL Driver
 * Library: pg (node-postgres) — connection pool
 */
class PostgresDriver extends Connection {
  constructor(config) {
    super(config);
    this._pool = null;
  }

  async connect(retryCount = 0) {
    const { Pool } = require('pg');

    try {
      this._pool = new Pool({
        host:               this.config.host,
        port:               this.config.port,
        database:           this.config.database,
        user:               this.config.username,
        password:           this.config.password,
        ssl:                this.config.ssl || false,
        min:                this.config.pool?.min || 2,
        max:                this.config.pool?.max || 10,
        idleTimeoutMillis:  this.config.pool?.idleTimeoutMillis || 30_000,
      });

      // Pool events
      this._pool.on('connect', () => {
        logger.debug('[PostgreSQL] New client connected to pool');
      });

      this._pool.on('error', (err) => {
        logger.error(`[PostgreSQL] Unexpected error on idle client: ${err.message}`);
      });

      // Test connection
      const client = await this._pool.connect();
      client.release();
      this._client = this._pool;

      logger.info(`✅ [PostgreSQL] Connected → "${this.config.database}" @ ${this.config.host}:${this.config.port}`);
    } catch (err) {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        logger.warn(`[PostgreSQL] Connection failed, retrying (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connect(retryCount + 1);
      }
      throw new ConnectionError(`[PostgreSQL] Failed to connect: ${err.message}`, { 
        driver: 'postgres', 
        context: { host: this.config.host, database: this.config.database } 
      });
    }
  }

  async disconnect() {
    if (this._pool) {
      await this._pool.end();
      this._client = null;
      this._pool   = null;
      logger.info('🔌 [PostgreSQL] Disconnected');
    }
  }

  async query(sql, bindings = []) {
    try {
      const result = await this._pool.query(sql, bindings);
      return result.rows;
    } catch (err) {
      throw new QueryError(`[PostgreSQL] Query failed: ${err.message}`, { 
        driver: 'postgres', 
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
    const client = await this._pool.connect();
    await client.query('BEGIN');
    return client;
  }

  async commit(client) {
    try {
      await client.query('COMMIT');
    } catch (err) {
      throw new TransactionError(`[PostgreSQL] Commit failed: ${err.message}`, { driver: 'postgres' });
    } finally {
      client.release();
    }
  }

  async rollback(client) {
    try {
      await client.query('ROLLBACK');
    } catch (err) {
      logger.error(`[PostgreSQL] Rollback failed: ${err.message}`);
    } finally {
      client.release();
    }
  }
}

module.exports = PostgresDriver;
