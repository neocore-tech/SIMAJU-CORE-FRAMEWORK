'use strict';

const logger = require('./logger');

/**
 * AI Smart Utility (Bab 22)
 * ─────────────────────────────────────────────────────────────
 */
class AISmart {
  static async getSuggestion(userData) {
    logger.info({ userData }, '[AI] Generating smart suggestion...');
    // Implementasi integrasi Gemini / OpenAI di sini
    return {
      recommendation: "Mungkin user butuh restock produk X berdasarkan tren penjualan bulan lalu."
    };
  }
}

module.exports = AISmart;
