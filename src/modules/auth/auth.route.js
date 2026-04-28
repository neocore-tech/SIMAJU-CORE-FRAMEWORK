'use strict';

const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const AuthValidation = require('./auth.validation');
const jwtAuth = require('../../../api/v1/middlewares/jwt.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@simaju.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', AuthValidation.login, AuthController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_lengkap:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nomor_hp:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register', AuthValidation.register, AuthController.register);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', jwtAuth, AuthController.getMe);

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/logout', (req, res) => AuthController.logout(req, res));

module.exports = router;
