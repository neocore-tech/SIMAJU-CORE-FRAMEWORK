const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logger = require('../utils/logger');
const DB = require('../database');
const { DatabaseError } = require('../database/errors');
const router = require('./router');
const webRouter = require('./web-router');
const activityLog = require('../middlewares/activity-log.middleware');
const tenantIdentify = require('../middlewares/tenant.middleware');
const apiKeyAuth = require('../middlewares/api-key.middleware');
const apiLimiter = require('../middlewares/rate-limit.middleware');
const scheduler = require('./scheduler');
const ThemeManager = require('./theme-manager');
const path = require('path');

const app = express();

// ── Security ──────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}
// In development, we skip helmet to avoid CSP issues with the Pretty Error Page

// ── Static Files ──────────────────────────────────────────────
// public/ di root project (seperti Laravel) bukan di dalam src/
const publicPath = path.join(__dirname, '../../public');
app.use(express.static(publicPath));

// uploads/ untuk file yang diupload user
const uploadsPath = path.join(publicPath, 'uploads');
if (!require('fs').existsSync(uploadsPath)) {
  require('fs').mkdirSync(uploadsPath, { recursive: true });
}

// ── Theme Static Files ────────────────────────────────────────
const themePublicPath = ThemeManager.getThemePublicPath();
if (themePublicPath) {
  app.use('/theme', express.static(themePublicPath));
}

// ── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', ThemeManager.getViewPaths());

// ── JSON Body Parser ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Web Routes ────────────────────────────────────────────────
app.use('/', webRouter);

// ── API Middlewares ───────────────────────────────────────────
app.use('/api', activityLog);
app.use('/api', apiKeyAuth);
app.use('/api', tenantIdentify);

// ── API Routes ────────────────────────────────────────────────
app.use('/api', apiLimiter, router);

// ── Plugins ───────────────────────────────────────────────────
// Boot is now handled in index.js bootstrap

// ── Request Logger ────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    }, 'HTTP Request');
  });
  next();
});

// ── Health Check Endpoint ─────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    const report = await DB.health();
    const status = report.status === 'healthy' ? 200 : 503;
    res.status(status).json({
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: report
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── Global Error Handler ──────────────────────────────────────
const errorHandler = require('../middlewares/error-handler.middleware');
app.use(errorHandler);

module.exports = app;
