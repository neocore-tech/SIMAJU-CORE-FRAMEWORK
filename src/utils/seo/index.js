'use strict';

/**
 * SEO Utilities — Entry Point
 * ─────────────────────────────────────────────────────────────
 * Lokasi: src/utils/seo/index.js
 *
 * Usage:
 *   const { buildMeta, robotsHandler, sitemapHandler, breadcrumbSchema } = require('./utils/seo');
 */

const meta    = require('./meta');
const robots  = require('./robots');
const sitemap = require('./sitemap');
const schema  = require('./schema');

module.exports = {
  // Meta tags
  buildMeta      : meta.buildMeta,
  metaMiddleware : meta.metaMiddleware,

  // Robots.txt
  generateRobots : robots.generateRobots,
  robotsHandler  : robots.robotsHandler,

  // Sitemap.xml
  generateSitemap : sitemap.generateSitemap,
  sitemapHandler  : sitemap.sitemapHandler,

  // JSON-LD Schema
  organizationSchema : schema.organizationSchema,
  websiteSchema      : schema.websiteSchema,
  breadcrumbSchema   : schema.breadcrumbSchema,
  articleSchema      : schema.articleSchema,
  toScriptTag        : schema.toScriptTag,
};
