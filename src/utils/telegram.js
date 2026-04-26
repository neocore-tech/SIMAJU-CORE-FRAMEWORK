'use strict';

const https = require('https');
const logger = require('./logger');

/**
 * Telegram Bot Utility (Bab 26)
 * ─────────────────────────────────────────────────────────────
 * Mengirim pesan ke Telegram menggunakan Bot API.
 */
class Telegram {
  /**
   * Kirim pesan ke chat ID tertentu
   * @param {string|number} chatId 
   * @param {string} text 
   */
  static async send(chatId, text) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn('[Telegram] Skip sending: TELEGRAM_BOT_TOKEN is not set');
      return false;
    }

    const data = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let response = '';
        res.on('data', (chunk) => { response += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            logger.info({ chatId }, '[Telegram] Message sent');
            resolve(JSON.parse(response));
          } else {
            logger.error({ status: res.statusCode, response }, '[Telegram] Failed to send message');
            reject(new Error(`Telegram API Error: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (err) => {
        logger.error({ err }, '[Telegram] Request error');
        reject(err);
      });

      req.write(data);
      req.end();
    });
  }
}

module.exports = Telegram;
