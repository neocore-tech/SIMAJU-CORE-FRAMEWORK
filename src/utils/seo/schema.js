'use strict';

/**
 * SEO Schema.org Utility (JSON-LD)
 * ─────────────────────────────────────────────────────────────
 * Generate JSON-LD structured data untuk rich results di Google.
 * Lokasi: src/utils/seo/schema.js
 */

/**
 * Wrap schema object menjadi <script type="application/ld+json"> tag.
 * @param {object} schemaObj
 * @returns {string}
 */
function toScriptTag(schemaObj) {
  return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
}

/**
 * Schema: Organization
 */
function organizationSchema({ name, url, logo, contactEmail } = {}) {
  return toScriptTag({
    '@context' : 'https://schema.org',
    '@type'    : 'Organization',
    name,
    url,
    logo,
    contactPoint: contactEmail ? {
      '@type'          : 'ContactPoint',
      email            : contactEmail,
      contactType      : 'customer support',
    } : undefined,
  });
}

/**
 * Schema: WebSite (dengan SearchAction untuk sitelinks search box)
 */
function websiteSchema({ name, url, searchUrl } = {}) {
  return toScriptTag({
    '@context' : 'https://schema.org',
    '@type'    : 'WebSite',
    name,
    url,
    potentialAction: searchUrl ? {
      '@type'       : 'SearchAction',
      target        : `${searchUrl}?q={search_term_string}`,
      'query-input' : 'required name=search_term_string',
    } : undefined,
  });
}

/**
 * Schema: BreadcrumbList
 * @param {Array<{name: string, url: string}>} items
 */
function breadcrumbSchema(items = []) {
  return toScriptTag({
    '@context'        : 'https://schema.org',
    '@type'           : 'BreadcrumbList',
    itemListElement   : items.map((item, i) => ({
      '@type'    : 'ListItem',
      position   : i + 1,
      name       : item.name,
      item       : item.url,
    })),
  });
}

/**
 * Schema: Article / BlogPosting
 */
function articleSchema({ headline, author, datePublished, dateModified, image, url } = {}) {
  return toScriptTag({
    '@context'     : 'https://schema.org',
    '@type'        : 'Article',
    headline,
    author         : { '@type': 'Person', name: author },
    datePublished,
    dateModified   : dateModified || datePublished,
    image,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  });
}

module.exports = {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  articleSchema,
  toScriptTag,
};
