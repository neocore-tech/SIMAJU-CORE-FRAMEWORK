'use strict';

const logger = require('./logger');

/**
 * WhatsApp Utility
 * ─────────────────────────────────────────────────────────────
 * Integrasi dengan WhatsApp Gateway (Fonnte, Twilio, wamd, dll)
 */
class WhatsApp {
  /**
   * Kirim pesan WhatsApp
   * @param {string} to - Nomor tujuan (62xxx)
   * @param {string} message - Isi pesan
   */
  static async send(to, message) {
    logger.info({ to }, `[WhatsApp] Sending message: ${message.substring(0, 20)}...`);
    
    // Logika integrasi API Gateway di sini
    // Contoh: axios.post('gateway-url', { to, message })
    
    return true;
  }
}

module.exports = WhatsApp;
