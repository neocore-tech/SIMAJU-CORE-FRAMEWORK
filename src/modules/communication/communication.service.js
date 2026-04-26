'use strict';

const Mail = require('../../utils/mail');
const Notification = require('../../utils/notification');
const Telegram = require('../../utils/telegram');
const logger = require('../../utils/logger');
const DB = require('../../database');

/**
 * Communication Service (Bab 7 & 26)
 * ─────────────────────────────────────────────────────────────
 */
class CommunicationService {
  /**
   * Kirim Email
   */
  async sendEmail(to, subject, body) {
    try {
      await Mail.send(to, subject, body);
      await this._logCommunication('email', to, subject);
      return true;
    } catch (err) {
      logger.error({ err }, '[Comm] Email failed');
      throw err;
    }
  }

  /**
   * Kirim Notifikasi Multi-channel
   */
  async sendNotification(userId, message, type = 'info') {
    try {
      await Notification.send(userId, message, type);
      await this._logCommunication('notification', userId, message);
      return true;
    } catch (err) {
      logger.error({ err }, '[Comm] Notification failed');
      throw err;
    }
  }

  /**
   * Kirim Telegram
   */
  async sendTelegram(chatId, text) {
    try {
      await Telegram.send(chatId, text);
      await this._logCommunication('telegram', chatId, text);
      return true;
    } catch (err) {
      logger.error({ err }, '[Comm] Telegram failed');
      throw err;
    }
  }

  /**
   * Kirim WhatsApp
   */
  async sendWhatsApp(to, message) {
    const WhatsApp = require('../../utils/whatsapp');
    try {
      await WhatsApp.send(to, message);
      await this._logCommunication('whatsapp', to, message);
      return true;
    } catch (err) {
      logger.error({ err }, '[Comm] WhatsApp failed');
      throw err;
    }
  }

  /**
   * Broadcast ke semua user (Bab 26)
   */
  async broadcast(message, type = 'info') {
    try {
      await Notification.broadcast(message, type);
      await this._logCommunication('broadcast', 'all', message);
      return true;
    } catch (err) {
      logger.error({ err }, '[Comm] Broadcast failed');
      throw err;
    }
  }

  /**
   * Catat riwayat komunikasi
   */
  async _logCommunication(channel, recipient, content) {
    try {
      await DB.table('communication_logs').insert({
        channel,
        recipient: String(recipient),
        content: typeof content === 'string' ? content : JSON.stringify(content),
        created_at: new Date()
      });
    } catch (err) {
      // Jangan block jika log gagal
    }
  }
}

module.exports = new CommunicationService();
