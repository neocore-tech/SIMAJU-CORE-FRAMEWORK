'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const UserController = require('./user.controller');
const UserValidation = require('./user.validation');
const auth = require('../../middlewares/auth.middleware');

/**
 * Multer Config for File Uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images'); // sesuaikan dengan folder static
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * User Routes (Bab 2)
 * ─────────────────────────────────────────────────────────────
 */

// Semua route di sini dilindungi Auth Middleware
router.use(auth);

router.get('/profile',                   (req, res) => UserController.getProfile(req, res));
router.put('/profile', UserValidation.updateProfile, (req, res) => UserController.updateProfile(req, res));

router.post('/ktp',    UserValidation.updateKtp,     (req, res) => UserController.updateKtp(req, res));

// Upload Dokumen (KTP/SIM/dll)
router.post('/upload-document', upload.single('document'), (req, res) => UserController.uploadDocument(req, res));

module.exports = router;
