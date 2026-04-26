'use strict';

/**
 * Base Connection Class
 * ─────────────────────────────────────────────────────────────
 * Semua driver extend class ini.
 * Menjamin setiap driver punya interface yang seragam.
 */
class Connection {
  constructor(config) {
    this.config  = config;
    this.driver  = config.driver;
    this._client = null;
  }

  /** Buka koneksi ke database */
  async connect() {
    throw new Error(`[${this.driver}] harus implement connect()`);
  }

  /** Tutup koneksi */
  async disconnect() {
    throw new Error(`[${this.driver}] harus implement disconnect()`);
  }

  /**
   * Jalankan raw query
   * @param {string} sql
   * @param {Array}  bindings
   */
  async query(sql, bindings = []) {
    throw new Error(`[${this.driver}] harus implement query()`);
  }

  /** Kembalikan QueryBuilder untuk tabel tertentu */
  table(tableName) {
    const QueryBuilder = require('./query-builder');
    return new QueryBuilder(this, tableName);
  }

  isConnected() {
    return this._client !== null;
  }
}

module.exports = Connection;
