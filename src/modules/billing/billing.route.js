'use strict';

const express = require('express');
const router = express.Router();
const billingController = require('./billing.controller');
const { requireAuth } = require('../../middlewares/jwt.middleware');

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: ISP Billing & Mikrotik Radius Management
 */

// Semua rute billing butuh otentikasi
router.use(requireAuth);

/**
 * @swagger
 * /api/v1/billing/routers:
 *   get:
 *     summary: Get all MikroTik routers
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of routers
 */
router.get('/routers', billingController.getRouters);

/**
 * @swagger
 * /api/v1/billing/packages:
 *   get:
 *     summary: Get all billing packages
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of packages
 */
router.get('/packages', billingController.getPackages);

/**
 * @swagger
 * /api/v1/billing/mikrotik/users:
 *   get:
 *     summary: Get active hotspot/pppoe users directly from router
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of active users in Mikrotik
 */
router.get('/mikrotik/users', billingController.getActiveMikrotikUsers);

/**
 * @swagger
 * /api/v1/billing/radius/users:
 *   post:
 *     summary: Create a new RADIUS user
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               packageId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/radius/users', billingController.createRadiusUser);

module.exports = router;
