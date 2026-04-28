'use strict';

const db = require('../../../config/database');

class SitemapService {
  /**
   * Mengumpulkan semua URL dari database dan mengubahnya ke format XML
   */
  async generateXml(baseUrl = 'https://simaju.com') {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. URL Statis (Homepage, About)
    xml += this._createUrlNode(`${baseUrl}/`, '1.0', 'daily');
    xml += this._createUrlNode(`${baseUrl}/about`, '0.8', 'monthly');

    // 2. URL Dinamis dari CMS Posts
    try {
      const posts = await db('cms_posts').where({ status: 'published' }).select('slug', 'updated_at');
      posts.forEach(post => {
        xml += this._createUrlNode(`${baseUrl}/blog/${post.slug}`, '0.8', 'weekly', post.updated_at);
      });
    } catch (e) {
      // Abaikan jika tabel tidak ada (modul CMS tidak diinstall)
    }

    xml += '</urlset>';
    return xml;
  }

  _createUrlNode(loc, priority = '0.5', changefreq = 'weekly', lastmod = null) {
    const date = lastmod ? new Date(lastmod).toISOString() : new Date().toISOString();
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
}

module.exports = new SitemapService();
