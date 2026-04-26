'use strict';

/**
 * Sitemap Generator (Bab 9.3)
 * ─────────────────────────────────────────────────────────────
 * Menghasilkan format XML sitemap secara dinamis.
 */
class Sitemap {
  constructor() {
    this.urls = [];
  }

  /**
   * Tambahkan URL ke daftar sitemap
   * @param {string} loc - URL lokasi
   * @param {string} lastmod - Tanggal terakhir diubah (YYYY-MM-DD)
   * @param {string} changefreq - 'daily', 'weekly', dll
   * @param {string} priority - '1.0', '0.8', dll
   */
  add(loc, lastmod = new Date().toISOString().split('T')[0], changefreq = 'weekly', priority = '0.5') {
    this.urls.push({ loc, lastmod, changefreq, priority });
  }

  /**
   * Generate XML String
   */
  generate() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    this.urls.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${url.loc}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  }
}

module.exports = new Sitemap();
