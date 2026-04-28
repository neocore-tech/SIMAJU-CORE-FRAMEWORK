'use strict';

/**
 * Auth Test
 * ─────────────────────────────────────────────────────────────
 * Test dasar untuk auth flow: login, register, token.
 * Jalankan: node tests/auth.test.js
 */

const assert = require('assert');

// ── Helpers ───────────────────────────────────────────────────
async function fetchJSON(url, options = {}) {
  const http = url.startsWith('https') ? require('https') : require('http');
  return new Promise((resolve, reject) => {
    const opts = { ...new URL(url), method: options.method || 'GET', headers: options.headers || {} };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

const BASE = process.env.TEST_URL || 'http://localhost:3000';

// ── Tests ─────────────────────────────────────────────────────
const results = [];

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: 'PASS' });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
    console.log(`  ❌ ${name}: ${err.message}`);
  }
}

(async () => {
  console.log('\n🧪 Auth Tests\n');

  await test('POST /api/v1/auth/login — bad credentials returns 401', async () => {
    const r = await fetchJSON(`${BASE}/api/v1/auth/login`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : { email: 'wrong@wrong.com', password: 'wrongpass' },
    });
    assert.strictEqual(r.status, 401, `Expected 401, got ${r.status}`);
  });

  await test('POST /api/v1/auth/login — missing fields returns 422', async () => {
    const r = await fetchJSON(`${BASE}/api/v1/auth/login`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : {},
    });
    assert.ok([400, 422].includes(r.status), `Expected 400/422, got ${r.status}`);
  });

  await test('GET /api/v1/auth/me — no token returns 401', async () => {
    const r = await fetchJSON(`${BASE}/api/v1/auth/me`);
    assert.strictEqual(r.status, 401, `Expected 401, got ${r.status}`);
  });

  // Ringkasan
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`\n📊 ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
