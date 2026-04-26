'use strict';

const cron = require('node-cron');
const logger = require('../utils/logger');

/**
 * Global Scheduler (Bab 16)
 * ─────────────────────────────────────────────────────────────
 */
class Scheduler {
  init() {
    logger.info('[Scheduler] Initializing background tasks...');

    // Contoh: Harian jam 00:00 (Cek stok menipis)
    cron.schedule('0 0 * * *', async () => {
      logger.info('[Scheduler] Running daily stock check...');
      // Implementasi cek stok di sini
    });

    // Contoh: Setiap jam (Bersihkan log lama)
    cron.schedule('0 * * * *', () => {
      logger.info('[Scheduler] Running hourly maintenance...');
    });
  }
}

module.exports = new Scheduler();
