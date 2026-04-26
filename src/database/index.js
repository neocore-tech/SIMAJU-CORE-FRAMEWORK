const logger = require('../utils/logger');
const { ConnectionError } = require('./errors');
const TransactionManager = require('./transaction');

const DRIVERS = {
  mysql:    () => require('./drivers/mysql.driver'),
  postgres: () => require('./drivers/postgres.driver'),
  sqlite:   () => require('./drivers/sqlite.driver'),
  mongodb:  () => require('./drivers/mongodb.driver'),
};

class DatabaseManager {
  constructor() {
    this._config      = null;
    this._connections = {};   // cache koneksi aktif
    this._default     = null;
    this._transactions = new TransactionManager(this);
  }

  // ── Boot ────────────────────────────────────────────────────
  /**
   * Inisialisasi DB Manager dengan config.
   * Panggil SEKALI di entry point aplikasi (index.js / app.js).
   *
   * @param {Object} config - isi dari src/config/database.js
   */
  async boot(config) {
    this._config  = config;
    this._default = config.default;

    logger.info(`[DB] Booting with default connection: ${this._default}`);
    
    // Auto-connect ke default connection
    try {
      await this._resolveConnection(this._default);
    } catch (err) {
      logger.error({ err }, `[DB] Failed to connect to default connection [${this._default}]`);
      // We don't necessarily want to crash here if we support multiple connections,
      // but usually the default one is critical.
    }
    return this;
  }

  // ── Connection Resolver ─────────────────────────────────────
  /**
   * Resolve dan cache koneksi berdasarkan nama.
   * @param {string} name
   * @returns {Promise<Connection>}
   */
  async _resolveConnection(name) {
    // Sudah terhubung? Kembalikan cache
    if (this._connections[name]) return this._connections[name];

    const connConfig = this._config?.connections?.[name];
    if (!connConfig) {
      throw new Error(
        `[DB] Connection "${name}" tidak ditemukan di config.\n` +
        `Koneksi tersedia: ${Object.keys(this._config?.connections || {}).join(', ')}`
      );
    }

    const driverName = connConfig.driver;
    const getDriver  = DRIVERS[driverName];
    if (!getDriver) {
      throw new Error(
        `[DB] Driver "${driverName}" tidak didukung.\n` +
        `Driver tersedia: ${Object.keys(DRIVERS).join(', ')}`
      );
    }

    const DriverClass = getDriver();
    const instance    = new DriverClass(connConfig);
    
    // Retry logic is now handled within the driver's connect method
    await instance.connect();

    this._connections[name] = instance;
    return instance;
  }

  // ── Public API ──────────────────────────────────────────────

  /**
   * Pilih connection by name (kembalikan proxy).
   */
  connection(name) {
    if (!this._config) {
      throw new Error('[DB] Panggil DB.boot(config) terlebih dahulu di entry point aplikasi.');
    }
    return new ConnectionProxy(this, name);
  }

  /**
   * Shortcut: gunakan default connection.
   */
  table(tableName) {
    return this.connection(this._default).table(tableName);
  }

  /**
   * Transaction support
   */
  async transaction(callback, connectionName) {
    return this._transactions.run(callback, connectionName);
  }

  /**
   * Health Check / Ping all active connections
   */
  async ping() {
    const results = {};
    for (const [name, conn] of Object.entries(this._connections)) {
      results[name] = await conn.ping();
    }
    return results;
  }

  /**
   * Get stats / health report
   */
  async health() {
    const pings = await this.ping();
    const active = Object.keys(this._connections);
    const isHealthy = active.length === 0 || Object.values(pings).every(v => v === true);

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      default: this._default,
      connections: pings,
    };
  }

  /**
   * Raw query pada default connection.
   */
  async raw(sql, bindings = []) {
    const conn = await this._resolveConnection(this._default);
    return conn.query(sql, bindings);
  }

  /**
   * Tutup semua koneksi aktif.
   */
  async disconnect() {
    logger.info('[DB] Closing all database connections...');
    for (const conn of Object.values(this._connections)) {
      await conn.disconnect();
    }
    this._connections = {};
  }

  // ── Getters / Setters ────────────────────────────────────────
  get Model()                      { return require('./model'); }
  get defaultConnection()          { return this._default; }
  setDefaultConnection(name)       { this._default = name; }
  getActiveConnections()           { return Object.keys(this._connections); }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * ConnectionProxy
 * Menunda resolve koneksi sampai benar-benar diperlukan (lazy).
 */
class ConnectionProxy {
  constructor(manager, connectionName) {
    this._manager    = manager;
    this._connName   = connectionName;
  }

  /**
   * Kembalikan QueryBuilder (lazy — belum resolve koneksi di sini).
   * @param {string} tableName
   * @returns {QueryBuilder}
   */
  table(tableName) {
    const QueryBuilder = require('./query-builder');
    return new QueryBuilder(this._manager, this._connName, tableName);
  }

  /** Raw query via koneksi ini */
  async raw(sql, bindings = []) {
    const conn = await this._manager._resolveConnection(this._connName);
    return conn.query(sql, bindings);
  }
}

// Singleton
module.exports = new DatabaseManager();
