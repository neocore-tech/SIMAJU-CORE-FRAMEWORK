'use strict';

class SchemaService {
  generateOrganization() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SIMAJU Tech",
      "url": "https://simaju.com",
      "logo": "https://simaju.com/logo.png"
    };
  }

  generateArticle(articleData) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleData.title,
      "image": [articleData.image],
      "datePublished": articleData.published_at,
      "dateModified": articleData.updated_at,
      "author": [{
          "@type": "Person",
          "name": articleData.author_name || 'Admin',
      }]
    };
  }

  generateFAQ(faqList) {
    // faqList is an array of { question, answer }
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqList.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  generateBreadcrumb(items) {
    // items is an array of { name, item_url }
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.item_url
      }))
    };
  }

  getSchemaScript(schemaObj) {
    return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
  }
}

module.exports = new SchemaService();
