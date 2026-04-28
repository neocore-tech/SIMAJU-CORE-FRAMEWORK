'use strict';

/**
 * Example: Custom Module
 * ─────────────────────────────────────────────────────────────
 * Menunjukkan cara membuat modul kustom dan mendaftarkannya.
 *
 * Jalankan:
 *   node examples/custom-module.js
 */

require('dotenv').config();

const { createApp } = require('../src/core/app');
const express       = require('express');

// ── 1. Definisikan modul kustom ────────────────────────────────
const helloRouter = express.Router();

helloRouter.get('/', (req, res) => {
  res.json({ message: 'Halo dari modul kustom!', timestamp: new Date() });
});

helloRouter.get('/:name', (req, res) => {
  res.json({ message: `Halo, ${req.params.name}!` });
});

// ── 2. Pasang ke aplikasi ──────────────────────────────────────
(async () => {
  const app  = await createApp();
  const PORT = process.env.PORT || 3001;

  // Mount modul kustom di prefix /api/v1/hello
  app.use('/api/v1/hello', helloRouter);

  app.listen(PORT, () => {
    console.log(`\n🚀 Server + custom module berjalan di http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/api/v1/hello`);
    console.log(`   GET http://localhost:${PORT}/api/v1/hello/Dunia\n`);
  });
})();
