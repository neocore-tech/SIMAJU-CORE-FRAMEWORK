'use strict';

const logger = require('./logger');
const EventBus = require('../core/event');

/**
 * Advanced Notification System (Bab 26)
 * ─────────────────────────────────────────────────────────────
 */
class Notification {
  /**
   * Kirim notifikasi ke user (Email + Real-time + Database)
   */
  static async send(userId, message, type = 'info') {
    logger.info({ userId, type }, `[Notification] ${message}`);

    // 1. Simpan ke Database
    // await DB.table('notifications').insert({ ... });

    // 2. Emit Event (Bisa ditangkap oleh Socket.io plugin)
    EventBus.emit('notification:sent', { userId, message, type });

    // 3. Kirim Email jika urgent
    if (type === 'urgent') {
      const Mail = require('./mail');
      // await Mail.send(...);
    }
  }

  /**
   * Kirim ke banyak user sekaligus
   */
  static async broadcast(message, type = 'info') {
    logger.info({ type }, `[Broadcast] ${message}`);
    EventBus.emit('notification:broadcast', { message, type });
  }
}

module.exports = Notification;
