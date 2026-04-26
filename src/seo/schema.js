'use strict';

/**
 * Schema.org (JSON-LD) Generator (Bab 9)
 * ─────────────────────────────────────────────────────────────
 */
class Schema {
  /**
   * Generate Product Schema
   */
  product(data) {
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": data.name,
      "image": data.image,
      "description": data.description,
      "sku": data.sku,
      "brand": {
        "@type": "Brand",
        "name": data.brand
      },
      "offers": {
        "@type": "Offer",
        "url": data.url,
        "priceCurrency": data.currency || "IDR",
        "price": data.price,
        "availability": "https://schema.org/InStock"
      }
    };
  }

  /**
   * Generate Article Schema
   */
  article(data) {
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": data.title,
      "image": [data.image],
      "datePublished": data.publishedAt,
      "dateModified": data.updatedAt,
      "author": {
        "@type": "Person",
        "name": data.authorName,
        "url": data.authorUrl
      }
    };
  }
}

module.exports = new Schema();
