'use strict';

/**
 * Base Model
 * ─────────────────────────────────────────────────────────────
 * Abstraksi CRUD standar untuk semua modul.
 * Extend class ini di model masing-masing modul.
 *
 * @example
 * class User extends Model {
 *   static get table() { return 'users'; }
 *   static get hidden() { return ['password']; }
 * }
 *
 * // Usage:
 * const user = await User.findById(1);
 * const users = await User.all();
 * const newUser = await User.create({ name: 'Neo', email: 'neo@matrix.com' });
 * await User.update(1, { name: 'Neo Updated' });
 * await User.delete(1);
 */
class Model {
  /**
   * Nama tabel di database — WAJIB dioverride di subclass.
   * @returns {string}
   */
  static get table() {
    throw new Error(`[Model] ${this.name} must define static get table()`);
  }

  /**
   * Field yang disembunyikan dari output (misal: password).
   * @returns {string[]}
   */
  static get hidden() {
    return [];
  }

  /**
   * Field yang boleh di-mass assign.
   * Jika kosong, semua field diperbolehkan.
   * @returns {string[]}
   */
  static get fillable() {
    return [];
  }

  // ── Internals ─────────────────────────────────────────────

  static get _db() {
    return require('./index');
  }

  static _query() {
    return this._db.table(this.table);
  }

  /**
   * Hapus hidden fields dari object atau array of objects.
   */
  static _sanitize(data) {
    if (!data) return null;
    if (Array.isArray(data)) return data.map(row => this._sanitize(row));
    const hidden = this.hidden;
    if (hidden.length === 0) return data;
    const sanitized = { ...data };
    hidden.forEach(field => delete sanitized[field]);
    return sanitized;
  }

  /**
   * Filter object hanya fillable fields (jika fillable didefinisikan).
   */
  static _filterFillable(data) {
    const fillable = this.fillable;
    if (fillable.length === 0) return data;
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => fillable.includes(key))
    );
  }

  // ── Query ─────────────────────────────────────────────────

  /**
   * Ambil semua record.
   * @returns {Promise<Object[]>}
   */
  static async all() {
    const rows = await this._query().get();
    return this._sanitize(rows);
  }

  /**
   * Cari record berdasarkan primary key (id).
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const row = await this._query().where('id', id).first();
    return this._sanitize(row);
  }

  /**
   * Cari record berdasarkan kolom & nilai tertentu.
   * @param {string} column
   * @param {*} value
   * @returns {Promise<Object|null>}
   */
  static async findBy(column, value) {
    const row = await this._query().where(column, value).first();
    return this._sanitize(row);
  }

  /**
   * Mulai chained query (mengembalikan QueryBuilder).
   * @returns {QueryBuilder}
   */
  static where(column, operatorOrValue, value) {
    return this._query().where(column, operatorOrValue, value);
  }

  /**
   * Ambil dengan pagination.
   * @param {number} page - halaman (1-based)
   * @param {number} perPage - jumlah per halaman
   * @returns {Promise<{data: Object[], total: number, page: number, perPage: number, lastPage: number}>}
   */
  static async paginate(page = 1, perPage = 15) {
    const offset = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      this._query().limit(perPage).offset(offset).get(),
      this._query().count(),
    ]);

    return {
      data: this._sanitize(data),
      total,
      page,
      perPage,
      lastPage: Math.ceil(total / perPage),
    };
  }

  // ── Mutations ─────────────────────────────────────────────

  /**
   * Insert record baru.
   * @param {Object} data
   * @returns {Promise<Object>} - data yang baru diinsert beserta insertId
   */
  static async create(data) {
    const filtered = this._filterFillable(data);
    const result = await this._query().insert({
      ...filtered,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const id = result?.insertId || result?._id;
    return { id, ...filtered };
  }

  /**
   * Update record berdasarkan id.
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  static async update(id, data) {
    const filtered = this._filterFillable(data);
    await this._query().where('id', id).update({
      ...filtered,
      updated_at: new Date(),
    });
    return true;
  }

  /**
   * Hapus record berdasarkan id (hard delete).
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    await this._query().where('id', id).delete();
    return true;
  }

  /**
   * Soft delete — set deleted_at timestamp.
   * Tabel harus punya kolom `deleted_at`.
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  static async softDelete(id) {
    await this._query().where('id', id).update({
      deleted_at: new Date(),
      updated_at: new Date(),
    });
    return true;
  }

  /**
   * Hitung total record.
   * @returns {Promise<number>}
   */
  static async count() {
    return this._query().count();
  }

  /**
   * Cek apakah record dengan kolom & nilai tertentu ada.
   * @param {string} column
   * @param {*} value
   * @returns {Promise<boolean>}
   */
  static async exists(column, value) {
    const row = await this._query().where(column, value).first();
    return !!row;
  }
}

module.exports = Model;
