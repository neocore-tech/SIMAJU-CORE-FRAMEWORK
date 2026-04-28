'use strict';

/**
 * SEO Meta Utility
 * ─────────────────────────────────────────────────────────────
 * Generate dynamic <meta> tags untuk halaman HTML.
 * Lokasi: src/utils/seo/meta.js
 */

const defaults = {
  title       : 'SIMAJU',
  description : 'SIMAJU Core Framework',
  keywords    : '',
  author      : '',
  robots      : 'index, follow',
  ogType      : 'website',
  ogImage     : '',
  twitterCard : 'summary_large_image',
  canonical   : '',
};

/**
 * Build meta tag HTML string.
 * @param {object} options
 * @returns {string}
 */
function buildMeta(options = {}) {
  const o = { ...defaults, ...options };
  const esc = (s) => String(s).replace(/"/g, '&quot;');

  const tags = [
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    `<title>${esc(o.title)}</title>`,
    `<meta name="description" content="${esc(o.description)}">`,
    o.keywords ? `<meta name="keywords" content="${esc(o.keywords)}">` : '',
    o.author   ? `<meta name="author"   content="${esc(o.author)}">` : '',
    `<meta name="robots" content="${esc(o.robots)}">`,
    o.canonical ? `<link rel="canonical" href="${esc(o.canonical)}">` : '',
    // Open Graph
    `<meta property="og:title"       content="${esc(o.title)}">`,
    `<meta property="og:description" content="${esc(o.description)}">`,
    `<meta property="og:type"        content="${esc(o.ogType)}">`,
    o.ogImage    ? `<meta property="og:image" content="${esc(o.ogImage)}">` : '',
    o.canonical  ? `<meta property="og:url"   content="${esc(o.canonical)}">` : '',
    // Twitter Card
    `<meta name="twitter:card"        content="${esc(o.twitterCard)}">`,
    `<meta name="twitter:title"       content="${esc(o.title)}">`,
    `<meta name="twitter:description" content="${esc(o.description)}">`,
    o.ogImage ? `<meta name="twitter:image" content="${esc(o.ogImage)}">` : '',
  ];

  return tags.filter(Boolean).join('\n    ');
}

/**
 * Express middleware — inject meta ke res.locals supaya bisa dipakai di view.
 * @param {object} defaults
 */
function metaMiddleware(defaults = {}) {
  return (req, res, next) => {
    res.locals.buildMeta = (opts) => buildMeta({ ...defaults, ...opts });
    next();
  };
}

module.exports = { buildMeta, metaMiddleware };
