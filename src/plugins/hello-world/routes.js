'use strict';

const express = require('express');
const router = express.Router();

/**
 * Demo Route
 * Access at: GET /api/plugins/hello-world/greet
 */
router.get('/greet', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hello from Simaju Plugin System!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
