const { performance } = require('perf_hooks');
const logger = require('../utils/logger');
const { env } = require('../config/env');

/**
 * SQL Query Builder — Chainable API mirip Laravel
 * ─────────────────────────────────────────────────────────────
 */
class QueryBuilder {
  /**
   * @param {import('./connection')|import('./index').DatabaseManager} connOrManager
   * @param {string} tableOrConnName  - table name (direct) atau connection name (via manager)
   * @param {string} [table]          - jika dipanggil via manager
   */
  constructor(connOrManager, tableOrConnName, table) {
    if (table !== undefined) {
      // dipanggil dari DatabaseManager: lazy resolve connection
      this._manager        = connOrManager;
      this._connName       = tableOrConnName;
      this._connection     = null;
      this._table          = table;
    } else {
      // dipanggil langsung dari Connection
      this._manager    = null;
      this._connection = connOrManager;
      this._table      = tableOrConnName;
    }

    this._selects  = ['*'];
    this._wheres   = [];
    this._joins    = [];
    this._orderBys = [];
    this._limitVal  = null;
    this._offsetVal = null;
    this._transaction = null;
  }

  useTransaction(transaction) {
    this._transaction = transaction;
    return this;
  }

  // ── Lazy connection resolve ───────────────────────────────
  async _conn() {
    if (this._connection) return this._connection;
    this._connection = await this._manager._resolveConnection(this._connName);
    return this._connection;
  }

  async _execute(type, data = null) {
    const conn = await this._conn();
    const { sql, bindings } = this._buildSQL(type, data);
    
    const start = performance.now();
    try {
      let result;
      if (this._transaction) {
        // Execute on transaction client
        // This assumes the driver's query method can be called on the transaction client
        // or we need a specific method. For MySQL/PG, the transaction object is the client.
        result = await conn.query(sql, bindings, this._transaction);
      } else {
        result = await conn.query(sql, bindings);
      }
      
      const duration = performance.now() - start;
      this._logQuery(sql, bindings, duration);
      
      return result;
    } catch (err) {
      const duration = performance.now() - start;
      this._logQuery(sql, bindings, duration, err);
      throw err;
    }
  }

  _logQuery(sql, bindings, duration, err = null) {
    const ms = duration.toFixed(2);
    const data = { sql, bindings, ms };
    
    if (err) {
      logger.error({ ...data, err }, `[DB] Query Failed (${ms}ms)`);
    } else if (duration > env.slowQueryMs) {
      logger.warn(data, `[DB] Slow Query Detected (${ms}ms)`);
    } else {
      logger.debug(data, `[DB] Query Executed (${ms}ms)`);
    }
  }

  // ── SELECT ────────────────────────────────────────────────
  select(...columns) {
    this._selects = columns.flat();
    return this;
  }

  // ── WHERE ─────────────────────────────────────────────────
  where(column, operatorOrValue, value) {
    const clause = value === undefined
      ? { type: 'AND', column, operator: '=',            value: operatorOrValue }
      : { type: 'AND', column, operator: operatorOrValue, value };
    this._wheres.push(clause);
    return this;
  }

  orWhere(column, operatorOrValue, value) {
    const clause = value === undefined
      ? { type: 'OR', column, operator: '=',            value: operatorOrValue }
      : { type: 'OR', column, operator: operatorOrValue, value };
    this._wheres.push(clause);
    return this;
  }

  whereIn(column, values) {
    this._wheres.push({ type: 'AND', column, operator: 'IN', value: values });
    return this;
  }

  whereNull(column) {
    this._wheres.push({ type: 'AND', column, operator: 'IS NULL', value: null });
    return this;
  }

  whereNotNull(column) {
    this._wheres.push({ type: 'AND', column, operator: 'IS NOT NULL', value: null });
    return this;
  }

  // ── ORDER / LIMIT / OFFSET ────────────────────────────────
  orderBy(column, direction = 'ASC') {
    this._orderBys.push({ column, direction: direction.toUpperCase() });
    return this;
  }

  latest(column = 'created_at') { return this.orderBy(column, 'DESC'); }
  oldest(column = 'created_at') { return this.orderBy(column, 'ASC');  }

  limit(n)  { this._limitVal  = n; return this; }
  take(n)   { return this.limit(n);  }
  offset(n) { this._offsetVal = n; return this; }
  skip(n)   { return this.offset(n); }

  // ── JOIN ──────────────────────────────────────────────────
  join(table, first, op, second) {
    this._joins.push({ type: 'INNER', table, first, op, second }); return this;
  }
  leftJoin(table, first, op, second) {
    this._joins.push({ type: 'LEFT',  table, first, op, second }); return this;
  }
  rightJoin(table, first, op, second) {
    this._joins.push({ type: 'RIGHT', table, first, op, second }); return this;
  }

  // ── SQL Builder ───────────────────────────────────────────
  _buildSQL(type = 'SELECT', data = null) {
    const isPostgres = (this._connection?.driver === 'postgres');
    const bindings   = [];
    let   paramIdx   = 1;

    const placeholder = () => isPostgres ? `$${paramIdx++}` : '?';

    // ── SELECT ────────────────────────────────────────────
    const buildSelect = () => {
      let sql = `SELECT ${this._selects.join(', ')} FROM ${this._table}`;

      for (const j of this._joins) {
        sql += ` ${j.type} JOIN ${j.table} ON ${j.first} ${j.op} ${j.second}`;
      }
      sql += this._buildWhere(bindings, placeholder);
      if (this._orderBys.length) {
        sql += ' ORDER BY ' + this._orderBys.map(o => `${o.column} ${o.direction}`).join(', ');
      }
      if (this._limitVal  !== null) { sql += ` LIMIT ${placeholder()}`;  bindings.push(this._limitVal);  }
      if (this._offsetVal !== null) { sql += ` OFFSET ${placeholder()}`; bindings.push(this._offsetVal); }
      return sql;
    };

    // ── INSERT ────────────────────────────────────────────
    const buildInsert = () => {
      const keys  = Object.keys(data);
      const vals  = Object.values(data);
      const ph    = keys.map(() => { bindings.push(null); return placeholder(); });
      vals.forEach((v, i) => { bindings[i] = v; });
      return `INSERT INTO ${this._table} (${keys.join(', ')}) VALUES (${ph.join(', ')})`;
    };

    // ── UPDATE ────────────────────────────────────────────
    const buildUpdate = () => {
      const keys = Object.keys(data);
      const vals = Object.values(data);
      const set  = keys.map(k => { bindings.push(null); return `${k} = ${placeholder()}`; });
      vals.forEach((v, i) => { bindings[i] = v; });
      return `UPDATE ${this._table} SET ${set.join(', ')}` + this._buildWhere(bindings, placeholder);
    };

    // ── DELETE ────────────────────────────────────────────
    const buildDelete = () => {
      return `DELETE FROM ${this._table}` + this._buildWhere(bindings, placeholder);
    };

    const sqlMap = { SELECT: buildSelect, INSERT: buildInsert, UPDATE: buildUpdate, DELETE: buildDelete };
    return { sql: sqlMap[type](), bindings };
  }

  _buildWhere(bindings, placeholder) {
    if (!this._wheres.length) return '';
    const parts = this._wheres.map((w, i) => {
      const prefix = i === 0 ? 'WHERE' : w.type;
      if (w.operator === 'IN') {
        const ph = w.value.map(v => { bindings.push(v); return placeholder(); });
        return `${prefix} ${w.column} IN (${ph.join(', ')})`;
      }
      if (w.operator === 'IS NULL' || w.operator === 'IS NOT NULL') {
        return `${prefix} ${w.column} ${w.operator}`;
      }
      bindings.push(w.value);
      return `${prefix} ${w.column} ${w.operator} ${placeholder()}`;
    });
    return ' ' + parts.join(' ');
  }

  // ── Terminal Methods ──────────────────────────────────────
  async get() {
    return this._execute('SELECT');
  }

  async first() {
    this.limit(1);
    const rows = await this.get();
    return rows[0] ?? null;
  }

  async find(id, pk = 'id') {
    return this.where(pk, id).first();
  }

  async count() {
    const saved       = this._selects;
    this._selects     = ['COUNT(*) as aggregate'];
    
    // We can't easily use _execute for count because of the saved selects swap, 
    // unless we refactor _execute or manually measure here.
    // Let's manually measure for count to keep it simple for now.
    const conn = await this._conn();
    const { sql, bindings } = this._buildSQL('SELECT');
    
    const start = performance.now();
    try {
      const rows = await conn.query(sql, bindings);
      const duration = performance.now() - start;
      this._logQuery(sql, bindings, duration);
      
      this._selects = saved;
      const raw = rows[0]?.aggregate ?? rows[0]?.['count(*)'] ?? 0;
      return Number(raw);
    } catch (err) {
      this._logQuery(sql, bindings, performance.now() - start, err);
      this._selects = saved;
      throw err;
    }
  }

  async insert(data) {
    return this._execute('INSERT', data);
  }

  async update(data) {
    return this._execute('UPDATE', data);
  }

  async delete() {
    return this._execute('DELETE');
  }

  async raw(sql, bindings = []) {
    const conn = await this._conn();
    const start = performance.now();
    try {
      const result = await conn.query(sql, bindings);
      this._logQuery(sql, bindings, performance.now() - start);
      return result;
    } catch (err) {
      this._logQuery(sql, bindings, performance.now() - start, err);
      throw err;
    }
  }
}

module.exports = QueryBuilder;
