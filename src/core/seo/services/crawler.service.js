'use strict';

class CrawlerService {
  /**
   * Penganalisis teks HTML untuk mengekstrak semua tautan (link).
   * Fitur ini bisa digunakan di Dashboard Admin untuk memindai artikel CMS
   * dan memastikan tidak ada "Broken Link" (link mati) ke luar website.
   */
  extractLinks(htmlContent) {
    if (!htmlContent) return [];
    
    const links = [];
    const regex = /<a[^>]+href=["']([^"']+)["']/gi;
    let match;

    while ((match = regex.exec(htmlContent)) !== null) {
      links.push(match[1]);
    }

    // Mengembalikan daftar link yang unik (tidak ada duplikat)
    return [...new Set(links)]; 
  }
}

module.exports = new CrawlerService();
