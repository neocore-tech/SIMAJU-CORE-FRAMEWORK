'use strict';

const DB = require('./index');

/**
 * Base Model Class - Simaju ORM
 * ─────────────────────────────────────────────────────────────
 */
class Model {
  /**
   * Nama tabel (harus di-override oleh child class).
   */
  static table = '';

  /**
   * Primary Key field.
   */
  static primaryKey = 'id';

  constructor(attributes = {}) {
    this._attributes = { ...attributes };
    this._original = { ...attributes };
    
    // Assign attributes to the instance for easy access
    Object.keys(attributes).forEach(key => {
      this[key] = attributes[key];
    });
  }

  /**
   * Query Builder instance untuk model ini.
   */
  static query() {
    if (!this.table) {
      throw new Error(`[ORM] Property "table" belum didefinisikan pada model ${this.name}`);
    }
    return DB.table(this.table);
  }

  /**
   * Ambil semua data.
   */
  static async all() {
    const rows = await this.query().get();
    return rows.map(row => new this(row));
  }

  /**
   * Cari berdasarkan Primary Key.
   */
  static async find(id) {
    const row = await this.query().find(id, this.primaryKey);
    return row ? new this(row) : null;
  }

  /**
   * Create data baru.
   */
  static async create(data) {
    await this.query().insert({
      ...data,
      created_at: data.created_at || new Date(),
      updated_at: data.updated_at || new Date()
    });
    
    // Resolve ID (khusus driver yang mendukung return last ID)
    // Untuk simplifikasi, kita asumsikan ID ada di data atau ambil record terakhir
    const last = await this.query().orderBy(this.primaryKey, 'DESC').first();
    return new this(last);
  }

  /**
   * Simpan perubahan pada instance (Active Record pattern).
   */
  async save() {
    const table = this.constructor.table;
    const pk = this.constructor.primaryKey;
    const id = this[pk];

    const data = { ...this };
    delete data._attributes;
    delete data._original;

    if (id) {
      // Update
      await DB.table(table).where(pk, id).update({
        ...data,
        updated_at: new Date()
      });
    } else {
      // Insert
      await DB.table(table).insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      });
      const last = await DB.table(table).orderBy(pk, 'DESC').first();
      Object.assign(this, last);
    }
    return this;
  }

  /**
   * Hapus instance.
   */
  async delete() {
    const pk = this.constructor.primaryKey;
    if (this[pk]) {
      await DB.table(this.constructor.table).where(pk, this[pk]).delete();
    }
  }

  /**
   * Konversi ke JSON.
   */
  toJSON() {
    const data = { ...this };
    delete data._attributes;
    delete data._original;
    return data;
  }
}

module.exports = Model;
