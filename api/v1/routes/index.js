'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const PluginManager = require('../../../src/core/plugin-manager');

/**
 * V1 Router Aggregator
 * ─────────────────────────────────────────────────────────────
 * Mendaftarkan semua module routes secara dinamis ke /api/v1/...
 */

// Alias mapping for backward compatibility
const routeAliases = {
  'user': '/users',
  'role': '/roles',
  'category': '/categories',
  'product': '/products',
  'supplier': '/suppliers',
  'sale': '/sales',
  'purchase': '/purchases',
  'file': '/files',
  'tenant': '/tenants',
  'custom-field': '/custom-fields',
  'plugin-manager': '/admin/plugins'
};

const modulesPath = path.join(__dirname, '../../../src/modules');

if (fs.existsSync(modulesPath)) {
  const modules = fs.readdirSync(modulesPath);
  
  modules.forEach((moduleName) => {
    const moduleDir = path.join(modulesPath, moduleName);
    
    if (fs.statSync(moduleDir).isDirectory()) {
      const routeFile = path.join(moduleDir, `${moduleName}.route.js`);
      
      if (fs.existsSync(routeFile)) {
        try {
          const moduleRouter = require(routeFile);
          const routePrefix = routeAliases[moduleName] || `/${moduleName}`;
          router.use(routePrefix, moduleRouter);
        } catch (error) {
          console.error(`❌ Failed to load V1 API route for module [${moduleName}]:`, error.message);
        }
      }
    }
  });
}

// ── Plugin API Routes (mounted at /api/v1/plugins) ──────────
PluginManager.boot(router, '/plugins');

// ── Core API Routes ───────────────────────────────────────────
try {
  const seoRouter = require('../../../src/core/seo/seo.route');
  router.use('/seo', seoRouter);
} catch (err) {
  // Ignore if seo route doesn't exist
}

module.exports = router;
