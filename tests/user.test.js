'use strict';

/**
 * User Test
 * ─────────────────────────────────────────────────────────────
 * Test CRUD endpoint user.
 * Jalankan: node tests/user.test.js
 */

const assert = require('assert');

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

const BASE  = process.env.TEST_URL   || 'http://localhost:3000';
const TOKEN = process.env.TEST_TOKEN || '';

const headers = {
  'Content-Type'  : 'application/json',
  'Authorization' : `Bearer ${TOKEN}`,
};

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
  console.log('\n🧪 User Tests\n');

  await test('GET /api/v1/users — tanpa auth returns 401', async () => {
    const r = await fetchJSON(`${BASE}/api/v1/users`);
    assert.strictEqual(r.status, 401, `Expected 401, got ${r.status}`);
  });

  if (TOKEN) {
    await test('GET /api/v1/users — dengan auth returns 200', async () => {
      const r = await fetchJSON(`${BASE}/api/v1/users`, { headers });
      assert.strictEqual(r.status, 200, `Expected 200, got ${r.status}`);
    });

    await test('GET /api/v1/users/:id — user tidak ada returns 404', async () => {
      const r = await fetchJSON(`${BASE}/api/v1/users/999999`, { headers });
      assert.strictEqual(r.status, 404, `Expected 404, got ${r.status}`);
    });
  } else {
    console.log('  ⚠️  Set TEST_TOKEN env untuk test dengan autentikasi');
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`\n📊 ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
