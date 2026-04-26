const Connection = require('../connection');
const { ConnectionError, QueryError, TransactionError } = require('../errors');
const logger = require('../../utils/logger');

/**
 * MySQL Driver
 * Library: mysql2/promise (connection pool)
 */
class MySQLDriver extends Connection {
  constructor(config) {
    super(config);
    this._pool = null;
  }

  async connect(retryCount = 0) {
    const mysql = require('mysql2/promise');

    try {
      this._pool = mysql.createPool({
        host:             this.config.host,
        port:             this.config.port,
        database:         this.config.database,
        user:             this.config.username,
        password:         this.config.password,
        charset:          this.config.charset || 'utf8mb4',
        waitForConnections: true,
        connectionLimit:  this.config.pool?.connectionLimit || 10,
        queueLimit:       0,
      });

      // Pool events for monitoring
      this._pool.on('acquire', (connection) => {
        logger.debug(`[MySQL] Connection ${connection.threadId} acquired`);
      });

      this._pool.on('enqueue', () => {
        logger.warn('[MySQL] Waiting for available connection slot');
      });

      this._pool.on('release', (connection) => {
        logger.debug(`[MySQL] Connection ${connection.threadId} released`);
      });

      // Test connection
      const conn = await this._pool.getConnection();
      conn.release();
      this._client = this._pool;

      logger.info(`✅ [MySQL] Connected → "${this.config.database}" @ ${this.config.host}:${this.config.port}`);
    } catch (err) {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        logger.warn(`[MySQL] Connection failed, retrying (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connect(retryCount + 1);
      }
      throw new ConnectionError(`[MySQL] Failed to connect: ${err.message}`, { 
        driver: 'mysql', 
        context: { host: this.config.host, database: this.config.database } 
      });
    }
  }

  async disconnect() {
    if (this._pool) {
      await this._pool.end();
      this._client = null;
      this._pool   = null;
      logger.info('🔌 [MySQL] Disconnected');
    }
  }

  async query(sql, bindings = []) {
    try {
      const [rows] = await this._pool.query(sql, bindings);
      return rows;
    } catch (err) {
      throw new QueryError(`[MySQL] Query failed: ${err.message}`, { 
        driver: 'mysql', 
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
    const connection = await this._pool.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  async commit(connection) {
    try {
      await connection.commit();
    } catch (err) {
      throw new TransactionError(`[MySQL] Commit failed: ${err.message}`, { driver: 'mysql' });
    } finally {
      connection.release();
    }
  }

  async rollback(connection) {
    try {
      await connection.rollback();
    } catch (err) {
      logger.error(`[MySQL] Rollback failed: ${err.message}`);
    } finally {
      connection.release();
    }
  }
}

module.exports = MySQLDriver;
