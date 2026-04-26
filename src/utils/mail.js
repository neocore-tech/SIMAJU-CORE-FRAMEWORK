'use strict';

const logger = require('./logger');

/**
 * Mail Utility (Bab 7)
 * ─────────────────────────────────────────────────────────────
 * Placeholder untuk integrasi dengan nodemailer / mailgun / dll.
 */
class Mail {
  static async send(to, subject, body) {
    logger.info({ to, subject }, '[Mail] Sending email...');
    // Implementasi nodemailer di sini
    return true;
  }
}

module.exports = Mail;
