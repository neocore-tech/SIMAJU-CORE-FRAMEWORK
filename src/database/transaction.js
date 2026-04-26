const logger = require('../utils/logger');
const { TransactionError } = require('./errors');

/**
 * Transaction Manager
 * Provides a Laravel-like transaction API.
 */
class TransactionManager {
  /**
   * @param {import('./index')} dbManager
   */
  constructor(dbManager) {
    this._dbManager = dbManager;
  }

  /**
   * Execute a callback within a transaction.
   * 
   * @param {Function} callback - (transactionObject) => Promise<any>
   * @param {string} [connectionName]
   */
  async run(callback, connectionName) {
    const connName = connectionName || this._dbManager._default;
    const connection = await this._dbManager._resolveConnection(connName);

    if (typeof connection.beginTransaction !== 'function') {
      throw new TransactionError(`Driver [${connection.driver}] does not support transactions.`, { driver: connection.driver });
    }

    const trxClient = await connection.beginTransaction();
    const trxProxy = new TransactionProxy(this._dbManager, connection, trxClient);

    try {
      const result = await callback(trxProxy);
      await connection.commit(trxClient);
      return result;
    } catch (err) {
      await connection.rollback(trxClient);
      logger.error({ err }, `[DB] Transaction aborted: ${err.message}`);
      throw err;
    }
  }
}

/**
 * TransactionProxy
 * Acts like the DB facade but bound to a specific transaction client.
 */
class TransactionProxy {
  constructor(manager, connection, client) {
    this._manager = manager;
    this._connection = connection;
    this._client = client;
  }

  table(tableName) {
    const QueryBuilder = require('./query-builder');
    const qb = new QueryBuilder(this._connection, tableName);
    return qb.useTransaction(this._client);
  }

  async raw(sql, bindings = []) {
    return this._connection.query(sql, bindings, this._client);
  }
}

module.exports = TransactionManager;
