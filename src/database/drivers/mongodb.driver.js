const Connection = require('../connection');
const logger = require('../../utils/logger');

/**
 * MongoDB Driver
 * Library: mongoose
 */
class MongoDBDriver extends Connection {
  constructor(config) {
    super(config);
    this._mongoose = null;
    this._db       = null;
  }

  async connect(retryCount = 0) {
    const mongoose = require('mongoose');
    const url      = `${this.config.url}/${this.config.database}`;

    try {
      await mongoose.connect(url, this.config.options);
      this._client   = mongoose.connection;
      this._mongoose = mongoose;
      this._db       = mongoose.connection.db;

      this._client.on('error', (err) => {
        logger.error(`[MongoDB] Connection error: ${err.message}`);
      });

      this._client.on('disconnected', () => {
        logger.warn('[MongoDB] Disconnected from server');
      });

      logger.info(`✅ [MongoDB] Connected → "${this.config.database}" @ ${this.config.url}`);
    } catch (err) {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        logger.warn(`[MongoDB] Connection failed, retrying (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connect(retryCount + 1);
      }
      throw new Error(`[MongoDB] Failed to connect: ${err.message}`);
    }
  }

  async disconnect() {
    if (this._mongoose) {
      await this._mongoose.disconnect();
      this._client   = null;
      this._mongoose = null;
      this._db       = null;
      logger.info('🔌 [MongoDB] Disconnected');
    }
  }

  async query(collection, filter = {}, options = {}) {
    return this._db.collection(collection).find(filter, options).toArray();
  }

  async ping() {
    try {
      await this._db.admin().ping();
      return true;
    } catch (err) {
      return false;
    }
  }

  // ── Transaction Support ─────────────────────────────────────
  async beginTransaction() {
    const session = await this._mongoose.startSession();
    session.startTransaction();
    return session;
  }

  async commit(session) {
    await session.commitTransaction();
    session.endSession();
  }

  async rollback(session) {
    await session.abortTransaction();
    session.endSession();
  }

  table(collectionName) {
    return new MongoQueryBuilder(this._db, collectionName);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
class MongoQueryBuilder {
  constructor(db, collection) {
    this._db         = db;
    this._collection = collection;
    this._filter     = {};
    this._projection = {};
    this._sort       = {};
    this._limitVal   = null;
    this._skipVal    = null;
    this._session    = null;
  }

  useSession(session) {
    this._session = session;
    return this;
  }

  select(...fields) {
    fields.flat().forEach(f => { this._projection[f] = 1; });
    return this;
  }

  where(field, operatorOrValue, value) {
    const opMap = { '>': '$gt', '>=': '$gte', '<': '$lt', '<=': '$lte', '!=': '$ne', '<>': '$ne' };
    if (value === undefined) {
      this._filter[field] = operatorOrValue;
    } else {
      this._filter[field] = { [opMap[operatorOrValue] || '$eq']: value };
    }
    return this;
  }

  whereIn(field, values) {
    this._filter[field] = { $in: values }; return this;
  }

  whereNull(field)    { this._filter[field] = null;  return this; }
  whereNotNull(field) { this._filter[field] = { $ne: null }; return this; }

  orderBy(field, direction = 'ASC') {
    this._sort[field] = direction === 'DESC' ? -1 : 1; return this;
  }

  limit(n)  { this._limitVal = n; return this; }
  skip(n)   { this._skipVal  = n; return this; }

  async get() {
    const options = { session: this._session };
    let cursor = this._db.collection(this._collection).find(this._filter, options);
    if (Object.keys(this._projection).length) cursor = cursor.project(this._projection);
    if (Object.keys(this._sort).length)       cursor = cursor.sort(this._sort);
    if (this._skipVal  !== null)              cursor = cursor.skip(this._skipVal);
    if (this._limitVal !== null)              cursor = cursor.limit(this._limitVal);
    return cursor.toArray();
  }

  async first() {
    this.limit(1);
    const rows = await this.get();
    return rows[0] ?? null;
  }

  async find(id) {
    const { ObjectId } = require('mongodb');
    const options = { session: this._session };
    return this._db.collection(this._collection).findOne({ _id: new ObjectId(id) }, options);
  }

  async count() {
    const options = { session: this._session };
    return this._db.collection(this._collection).countDocuments(this._filter, options);
  }

  async insert(data) {
    const options = { session: this._session };
    const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
    return this._db.collection(this._collection).insertOne(doc, options);
  }

  async update(data) {
    const options = { session: this._session };
    return this._db.collection(this._collection).updateMany(
      this._filter,
      { $set: { ...data, updatedAt: new Date() } },
      options
    );
  }

  async delete() {
    const options = { session: this._session };
    return this._db.collection(this._collection).deleteMany(this._filter, options);
  }
}

module.exports = MongoDBDriver;
