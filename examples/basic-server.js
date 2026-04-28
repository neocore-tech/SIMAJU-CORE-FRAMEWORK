'use strict';

/**
 * Example: Basic Server
 * ─────────────────────────────────────────────────────────────
 * Contoh paling minimal untuk menjalankan SIMAJU framework.
 *
 * Jalankan:
 *   cp examples/basic-server.js my-app.js
 *   node my-app.js
 */

// Load env dari .env
require('dotenv').config();

const { createApp } = require('../src/core/app');

(async () => {
  const app = await createApp();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`\n🚀 SIMAJU berjalan di http://localhost:${PORT}\n`);
  });
})();
