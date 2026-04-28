'use strict';

class InternalLinkService {
  /**
   * Mengganti kata kunci dalam teks dengan link <a> ke artikel lain
   * Berguna untuk menciptakan jaring laba-laba SEO layaknya Wikipedia.
   * 
   * @param {string} htmlContent Teks HTML mentah dari CMS
   * @param {Array} keywordMap [{ keyword: "SEO", url: "https://simaju.com/blog/belajar-seo" }]
   */
  injectLinks(htmlContent, keywordMap) {
    if (!htmlContent || !keywordMap || keywordMap.length === 0) return htmlContent;

    let modifiedHtml = htmlContent;

    keywordMap.forEach(item => {
      // Hanya ganti 1 kemunculan pertama untuk mencegah over-optimization spam
      // Regex ini memastikan kita tidak mengganti teks yang sudah ada di dalam tag HTML lain (seperti href)
      const regex = new RegExp(`(?<!<[^>]*)\\b(${item.keyword})\\b(?![^<]*>)`, 'i');
      modifiedHtml = modifiedHtml.replace(regex, `<a href="${item.url}" title="${item.keyword}" class="internal-seo-link">$1</a>`);
    });

    return modifiedHtml;
  }
}

module.exports = new InternalLinkService();
