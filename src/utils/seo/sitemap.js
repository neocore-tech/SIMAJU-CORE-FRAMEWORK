'use strict';

/**
 * SEO Sitemap Utility
 * ─────────────────────────────────────────────────────────────
 * Generate sitemap.xml secara dinamis.
 * Lokasi: src/utils/seo/sitemap.js
 */

/**
 * @typedef {object} SitemapEntry
 * @property {string}  loc        - URL lengkap halaman
 * @property {string}  [lastmod]  - Tanggal terakhir diubah (YYYY-MM-DD)
 * @property {string}  [changefreq] - always|hourly|daily|weekly|monthly|yearly|never
 * @property {number}  [priority]   - 0.0 – 1.0
 */

/**
 * Generate XML sitemap dari array of entries.
 * @param {SitemapEntry[]} entries
 * @returns {string} XML string
 */
function generateSitemap(entries = []) {
  const today = new Date().toISOString().split('T')[0];

  const urls = entries.map((e) => {
    const loc        = `<loc>${e.loc}</loc>`;
    const lastmod    = `<lastmod>${e.lastmod || today}</lastmod>`;
    const changefreq = e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '';
    const priority   = e.priority   ? `<priority>${e.priority}</priority>` : '';

    return `  <url>\n    ${[loc, lastmod, changefreq, priority].filter(Boolean).join('\n    ')}\n  </url>`;
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join('\n');
}

/**
 * Express route handler — serve /sitemap.xml
 * Entries bisa berupa array statis atau fungsi async yang return array.
 * @param {SitemapEntry[]|Function} entriesOrFn
 */
function sitemapHandler(entriesOrFn = []) {
  return async (req, res) => {
    try {
      const entries = typeof entriesOrFn === 'function'
        ? await entriesOrFn(req)
        : entriesOrFn;

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.send(generateSitemap(entries));
    } catch (err) {
      res.status(500).send('Failed to generate sitemap.');
    }
  };
}

module.exports = { generateSitemap, sitemapHandler };
