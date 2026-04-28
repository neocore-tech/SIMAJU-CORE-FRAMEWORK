'use strict';

const logger = require('../../../utils/logger');

class SeoLoggerService {
  /**
   * Middleware untuk menangkap dan mencatat error 404 (Halaman Tidak Ditemukan).
   * Data ini sangat penting bagi Admin SEO untuk mengetahui URL mana yang rusak
   * dan perlu segera ditangani menggunakan fitur Redirect 301.
   */
  log404(req, res, next) {
    // Hanya log jika itu benar-benar 404 (biasanya di-attach setelah semua route gagal)
    logger.warn({
      event: 'SEO_404_NOT_FOUND',
      url: req.originalUrl,
      ip: req.ip,
      referer: req.get('Referrer') || 'Direct Traffic'
    }, `Broken Link Detected: ${req.originalUrl}`);
    
    next();
  }
}

module.exports = new SeoLoggerService();
