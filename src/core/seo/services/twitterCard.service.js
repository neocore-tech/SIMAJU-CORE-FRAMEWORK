'use strict';

class TwitterCardService {
  /**
   * Menghasilkan meta tag spesifik untuk Twitter Card
   */
  generate(data) {
    const {
      title,
      description,
      image,
      cardType = 'summary_large_image', // bisa juga 'summary'
      siteCreator = '@simaju_tech'
    } = data;

    return `
      <meta name="twitter:card" content="${cardType}" />
      <meta name="twitter:site" content="${siteCreator}" />
      <meta name="twitter:creator" content="${siteCreator}" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
    `.trim();
  }
}

module.exports = new TwitterCardService();
