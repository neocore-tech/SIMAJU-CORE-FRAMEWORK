'use strict';

const express = require('express');
const router = express.Router();
const PluginAdminController = require('./plugin-manager.controller');

/**
 * Admin Plugin Manager API
 */
router.get('/', PluginAdminController.index);
router.post('/install', PluginAdminController.install);

module.exports = router;
