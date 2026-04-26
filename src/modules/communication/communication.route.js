'use strict';

const express = require('express');
const router = express.Router();
const CommunicationController = require('./communication.controller');
const auth = require('../../middlewares/auth.middleware');
const can = require('../../middlewares/permission.middleware');

/**
 * Communication Routes (Bab 7 & 26)
 * ─────────────────────────────────────────────────────────────
 */

router.use(auth);

// Hanya admin yang bisa mengirim email manual atau broadcast
router.post('/send-email', can('send-email'), (req, res) => CommunicationController.sendEmail(req, res));
router.post('/broadcast',  can('broadcast'),  (req, res) => CommunicationController.broadcast(req, res));
router.post('/whatsapp',   can('send-whatsapp'), (req, res) => CommunicationController.sendWhatsApp(req, res));

module.exports = router;
