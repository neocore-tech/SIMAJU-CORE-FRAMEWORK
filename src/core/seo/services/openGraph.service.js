'use strict';

class OpenGraphService {
  /**
   * Menghasilkan meta tag spesifik untuk Facebook/OpenGraph
   */
  generate(data) {
    const {
      title,
      description,
      url,
      image,
      type = 'website',
      siteName = 'SIMAJU Framework',
      locale = 'id_ID'
    } = data;

    let tags = `
      <meta property="og:type" content="${type}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:site_name" content="${siteName}" />
      <meta property="og:locale" content="${locale}" />
    `.trim();

    // Jika ini adalah artikel
    if (type === 'article' && data.published_time) {
      tags += `\n<meta property="article:published_time" content="${data.published_time}" />`;
      if (data.author) tags += `\n<meta property="article:author" content="${data.author}" />`;
      if (data.section) tags += `\n<meta property="article:section" content="${data.section}" />`;
    }

    return tags;
  }
}

module.exports = new OpenGraphService();
