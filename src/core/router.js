'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const PluginManager = require('./plugin-manager');

/**
 * Global Router
 * ─────────────────────────────────────────────────────────────
 * Mendaftarkan semua module routes secara dinamis.
 */

// Alias mapping for backward compatibility (e.g. pluralization)
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

const modulesPath = path.join(__dirname, '../modules');

if (fs.existsSync(modulesPath)) {
  const modules = fs.readdirSync(modulesPath);
  
  modules.forEach((moduleName) => {
    const moduleDir = path.join(modulesPath, moduleName);
    
    // Ensure it's a directory
    if (fs.statSync(moduleDir).isDirectory()) {
      const routeFile = path.join(moduleDir, `${moduleName}.route.js`);
      
      // If a specific route file exists, register it
      if (fs.existsSync(routeFile)) {
        try {
          const moduleRouter = require(routeFile);
          const routePrefix = routeAliases[moduleName] || `/${moduleName}`;
          router.use(routePrefix, moduleRouter);
        } catch (error) {
          console.error(`❌ Failed to load route for module [${moduleName}]:`, error.message);
        }
      }
    }
  });
}

// ── Plugin Routes ─────────────────────────────────────────────
PluginManager.boot(router, '/plugins');

module.exports = router;
