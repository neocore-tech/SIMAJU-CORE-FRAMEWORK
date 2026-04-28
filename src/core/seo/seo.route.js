'use strict';

const express = require('express');
const router = express.Router();
const seoController = require('./seo.controller');

/**
 * @swagger
 * tags:
 *   name: SEO
 *   description: SEO Engine APIs
 */

/**
 * @swagger
 * /api/v1/seo/meta:
 *   get:
 *     summary: Get headless metadata for a page
 *     tags: [SEO]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meta JSON object
 */
router.get('/meta', seoController.getHeadlessMeta);

module.exports = router;
