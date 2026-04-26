'use strict';

const CommunicationService = require('./communication.service');
const Response = require('../../utils/response');

/**
 * Communication Controller
 * ─────────────────────────────────────────────────────────────
 */
class CommunicationController {
  /**
   * API untuk mengirim email manual (Admin)
   */
  async sendEmail(req, res) {
    const { to, subject, body } = req.body;
    try {
      await CommunicationService.sendEmail(to, subject, body);
      return Response.success(res, null, 'Email sent successfully');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  /**
   * API untuk Broadcast notifikasi
   */
  async broadcast(req, res) {
    const { message, type } = req.body;
    try {
      await CommunicationService.broadcast(message, type);
      return Response.success(res, null, 'Broadcast initiated');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  async sendWhatsApp(req, res) {
    const { to, message } = req.body;
    try {
      await CommunicationService.sendWhatsApp(to, message);
      return Response.success(res, null, 'WhatsApp message sent');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = new CommunicationController();
