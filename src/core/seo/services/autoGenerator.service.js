'use strict';

const metaService = require('./meta.service');
const schemaService = require('./schema.service');
const openGraphService = require('./openGraph.service');
const twitterCardService = require('./twitterCard.service');

class AutoGeneratorService {
  /**
   * Meng-generate semua elemen SEO secara otomatis dari satu payload data
   * Sangat cocok dipanggil sebelum me-render halaman View Engine (EJS)
   */
  generateAll(pageData) {
    const basicMeta = metaService.generateTags(pageData);
    const ogTags = openGraphService.generate(pageData);
    const twitterTags = twitterCardService.generate(pageData);
    
    const metaTags = `${basicMeta}\n${ogTags}\n${twitterTags}`;
    
    // Auto detect tipe skema berdasarkan tipe halaman
    let schemaJson = null;
    if (pageData.type === 'article') {
      schemaJson = schemaService.generateArticle(pageData);
    } else if (pageData.faqList) {
      schemaJson = schemaService.generateFAQ(pageData.faqList);
    } else {
      schemaJson = schemaService.generateOrganization();
    }
    
    const schemaScript = schemaService.getSchemaScript(schemaJson);

    return {
      metaHtml: metaTags,
      schemaHtml: schemaScript,
      fullHeadHtml: `${metaTags}\n${schemaScript}`
    };
  }
}

module.exports = new AutoGeneratorService();
