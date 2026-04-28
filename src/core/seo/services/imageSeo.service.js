'use strict';

class ImageSeoService {
  /**
   * Memindai tag <img> dalam HTML mentah dan memastikan atribut 'alt' terisi
   */
  autoFillAltTags(htmlContent, defaultAlt = 'SIMAJU Media') {
    if (!htmlContent) return '';
    
    // Cari semua <img> tag yang tidak punya alt atau alt-nya kosong
    return htmlContent.replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (!attrs.toLowerCase().includes('alt=') || /alt=["']\s*["']/.test(attrs)) {
        // Jika tidak ada alt atau kosong, tambahkan otomatis
        return `<img${attrs} alt="${defaultAlt}">`;
      }
      return match;
    });
  }

  /**
   * Menambahkan atribut loading="lazy" untuk performa rendering awal (LCP)
   */
  applyLazyLoad(htmlContent) {
    if (!htmlContent) return '';
    return htmlContent.replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (!attrs.toLowerCase().includes('loading=')) {
        return `<img${attrs} loading="lazy">`;
      }
      return match;
    });
  }
}

module.exports = new ImageSeoService();
