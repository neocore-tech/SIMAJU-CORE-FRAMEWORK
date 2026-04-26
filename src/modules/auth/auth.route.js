'use strict';

const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const AuthValidation = require('./auth.validation');

/**
 * Auth Routes (Bab 1)
 * ─────────────────────────────────────────────────────────────
 */

router.post('/register', AuthValidation.register, AuthController.register);
router.post('/login',    AuthValidation.login,    AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/logout',                            (req, res) => AuthController.logout(req, res));

module.exports = router;
