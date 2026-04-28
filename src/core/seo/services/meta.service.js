'use strict';

class MetaService {
  /**
   * Menghasilkan string HTML tag Meta & OpenGraph
   */
  generateTags(data) {
    const title = data.title || 'SIMAJU CORE';
    const description = data.description || 'Enterprise backend framework';
    const url = data.url || 'https://simaju.com';
    const image = data.image || 'https://simaju.com/default-og.png';
    const type = data.type || 'website';

    return `
      <title>${title}</title>
      <meta name="description" content="${description}" />
    `.trim();
  }

  /**
   * Format metadata mentah untuk response API Headless
   */
  getHeadlessMetadata(data) {
    return {
      title: data.title,
      description: data.description,
      openGraph: {
        type: data.type || 'website',
        url: data.url,
        title: data.title,
        description: data.description,
        images: [{ url: data.image }]
      }
    };
  }
}

module.exports = new MetaService();
