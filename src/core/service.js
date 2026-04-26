'use strict';

const DB = require('../database');
const logger = require('../utils/logger');

/**
 * Base Service (Bab 11)
 * ─────────────────────────────────────────────────────────────
 * Menyediakan akses DB dan Logger standar untuk semua service.
 */
class Service {
  constructor() {
    this.db = DB;
    this.logger = logger;
  }

  // Metode umum seperti paging, filter standar bisa diletakkan di sini
}

module.exports = Service;
