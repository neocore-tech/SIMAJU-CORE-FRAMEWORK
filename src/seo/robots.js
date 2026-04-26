'use strict';

/**
 * Robots.txt Generator (Bab 9.6)
 * ─────────────────────────────────────────────────────────────
 */
class Robots {
  generate(sitemapUrl = 'https://simaju.id/sitemap.xml') {
    return [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/auth/',
      'Disallow: /admin/',
      '',
      `Sitemap: ${sitemapUrl}`
    ].join('\n');
  }
}

module.exports = new Robots();
