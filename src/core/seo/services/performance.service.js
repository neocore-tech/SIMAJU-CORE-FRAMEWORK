'use strict';

class PerformanceService {
  /**
   * Simple HTML Minifier (Regex based)
   * Sangat berguna untuk memperkecil ukuran payload ke browser (Core Web Vitals boost)
   */
  minifyHtml(html) {
    if (!html) return '';
    return html
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/>\s+</g, '><') // Remove space between tags
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .trim();
  }
}

module.exports = new PerformanceService();
