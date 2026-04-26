'use strict';

/**
 * SEO Meta Generator (Bab 9)
 * ─────────────────────────────────────────────────────────────
 */
class SEOMeta {
  /**
   * Generate Meta Tags
   * @param {string} title 
   * @param {string} description 
   * @param {string[]} keywords 
   * @param {Object} extra 
   */
  generate(title, description, keywords = [], extra = {}) {
    const siteName = 'Simaju Core';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords.join(', ') },
        { name: 'robots', content: extra.robots || 'index, follow' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: extra.ogType || 'website' },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:image', content: extra.image || '' },
        { property: 'og:url', content: extra.url || '' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: extra.image || '' }
      ],
      link: [
        { rel: 'canonical', href: extra.url || '' }
      ]
    };
  }
}

module.exports = new SEOMeta();
