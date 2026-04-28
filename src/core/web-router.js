'use strict';

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

/**
 * Web Router
 * ─────────────────────────────────────────────────────────────
 * Mengelola semua halaman HTML (non-API).
 *
 * Struktur path (Laravel-style):
 *   Auth pages  → resources/views/auth/
 *   Admin pages → resources/views/admin/
 *   Welcome/Docs → welcome/
 */

// Root paths (Laravel-style)
const ROOT       = path.join(__dirname, '../..');
const RES_VIEWS  = path.join(ROOT, 'resources/views');
const WELCOME    = path.join(ROOT, 'public/welcome');

// Helper: kirim file HTML atau return 404
function sendHTML(res, filePath, label = 'Page') {
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send(`${label} not found.`);
}

// ── Welcome / Docs ────────────────────────────────────────────
// Hanya aktif jika APP_WELCOME !== 'false'
const welcomeEnabled = process.env.APP_WELCOME !== 'false';

if (welcomeEnabled) {
  router.get('/welcome', (req, res) =>
    sendHTML(res, path.join(WELCOME, 'index.html'), 'Welcome'));

  router.get('/ecosystem', (req, res) =>
    sendHTML(res, path.join(WELCOME, 'ecosystem.html'), 'Ecosystem'));

  router.get('/modules', (req, res) =>
    sendHTML(res, path.join(WELCOME, 'modules.html'), 'Modules'));

  // Docs
  router.get('/docs', (req, res) => res.redirect('/docs/intro'));

  const docPages = [
    'intro', 'basics', 'security', 'database',
    'architecture', 'advanced',
    'plugins', 'plugins-guide', 'modules-guide',
  ];

  const docFileMap = {
    'plugins':       'plugins-directory.html',
    'plugins-guide': 'plugin-guide.html',
    'modules-guide': 'module-guide.html',
  };

  for (const page of docPages) {
    const filename = docFileMap[page] || `${page}.html`;
    router.get(`/docs/${page}`, (req, res) =>
      sendHTML(res, path.join(WELCOME, 'docs', filename), `Docs: ${page}`));
  }
}

// ── Auth ──────────────────────────────────────────────────────
// Root: tampilkan welcome page, login di /login
router.get('/', (req, res) =>
  sendHTML(res, path.join(WELCOME, 'index.html'), 'Welcome'));

router.get('/login', (req, res) =>
  sendHTML(res, path.join(RES_VIEWS, 'auth/login.html'), 'Login'));

router.get('/register', (req, res) =>
  sendHTML(res, path.join(RES_VIEWS, 'auth/register.html'), 'Register'));

// ── Admin Panel ───────────────────────────────────────────────
router.get('/dashboard', (req, res) => {
  res.render('layouts/admin', {
    title: 'Dashboard',
    active: 'dashboard',
    view: 'admin/dashboard',
  });
});

router.get('/admin/plugins', (req, res) =>
  sendHTML(res, path.join(RES_VIEWS, 'admin/plugins.html'), 'Admin Plugins'));

module.exports = router;
