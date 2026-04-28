'use strict';

const express = require('express');
const router = express.Router();

const v1Routes = require('./routes');

/**
 * API Version 1 Entry Point
 * ─────────────────────────────────────────────────────────────
 * Apply version-specific middlewares here before mounting routes.
 */

// Mount all v1 routes
router.use('/', v1Routes);

module.exports = router;
