'use strict';

/**
 * SEO Robots.txt Utility
 * ─────────────────────────────────────────────────────────────
 * Generate dan serve file robots.txt secara dinamis.
 * Lokasi: src/utils/seo/robots.js
 */

/**
 * Generate isi robots.txt
 * @param {object} options
 * @param {string}   options.baseUrl   - Base URL aplikasi (e.g. https://example.com)
 * @param {string[]} options.disallow  - Path yang dilarang di-crawl
 * @param {string[]} options.allow     - Path yang diizinkan
 * @param {string}   options.userAgent - Default '*'
 * @param {boolean}  options.sitemap   - Sertakan link sitemap (default true)
 * @returns {string}
 */
function generateRobots(options = {}) {
  const {
    baseUrl   = process.env.APP_URL || 'http://localhost',
    disallow  = ['/admin', '/api', '/_', '/scripts'],
    allow     = ['/'],
    userAgent = '*',
    sitemap   = true,
  } = options;

  const lines = [
    `User-agent: ${userAgent}`,
    ...allow.map((p)   => `Allow: ${p}`),
    ...disallow.map((p) => `Disallow: ${p}`),
  ];

  if (sitemap) {
    lines.push('');
    lines.push(`Sitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml`);
  }

  return lines.join('\n');
}

/**
 * Express route handler — serve /robots.txt
 * @param {object} options - sama dengan generateRobots options
 */
function robotsHandler(options = {}) {
  return (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(generateRobots(options));
  };
}

module.exports = { generateRobots, robotsHandler };
