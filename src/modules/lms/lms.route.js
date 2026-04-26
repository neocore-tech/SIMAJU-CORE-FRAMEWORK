'use strict';

const express = require('express');
const router = express.Router();
const LmsController = require('./lms.controller');
const auth = require('../../middlewares/auth.middleware');

/**
 * LMS Module Routes
 * ─────────────────────────────────────────────────────────────
 */

// Public Routes
router.get('/catalog',      LmsController.catalog);
router.get('/courses/:slug', LmsController.courseDetail);

// Protected Student Routes
router.use(auth);
router.post('/enroll',      LmsController.enroll);
router.post('/lessons/:lessonId/complete', LmsController.completeLesson);

module.exports = router;
