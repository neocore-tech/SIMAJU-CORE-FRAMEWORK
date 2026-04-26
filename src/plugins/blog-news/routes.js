'use strict';

const express = require('express');
const router = express.Router();
const BlogController = require('./controller');

/**
 * Plugin Routes: /api/plugins/blog-news
 */
router.get('/posts', BlogController.index);
router.post('/posts', BlogController.store);

module.exports = router;
