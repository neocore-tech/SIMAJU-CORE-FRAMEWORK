'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Plugin Manager (Bab 10)
 * ─────────────────────────────────────────────────────────────
 * Mengelola deteksi dan pemuatan plugin secara dinamis.
 */
class PluginManager {
  static async boot(app) {
    const pluginDir = path.join(__dirname, '../plugins');
    
    if (!fs.existsSync(pluginDir)) {
      return;
    }

    const plugins = fs.readdirSync(pluginDir).filter(f => {
      return fs.statSync(path.join(pluginDir, f)).isDirectory();
    });

    for (const pluginName of plugins) {
      try {
        const pluginPath = path.join(pluginDir, pluginName);
        
        // 1. Load Metadata (plugin.json)
        const configPath = path.join(pluginPath, 'plugin.json');
        let metadata = { name: pluginName, version: '1.0.0' };
        
        if (fs.existsSync(configPath)) {
          metadata = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        // 2. Register Routes
        const routePath = path.join(pluginPath, 'routes.js');
        if (fs.existsSync(routePath)) {
          const routes = require(routePath);
          app.use(`/api/plugins/${pluginName}`, routes);
        }

        // 3. Register Events/Hooks (Optional index.js)
        const indexPath = path.join(pluginPath, 'index.js');
        if (fs.existsSync(indexPath)) {
          const pluginInit = require(indexPath);
          if (typeof pluginInit === 'function') {
            await pluginInit(app);
          }
        }

        logger.info(`🔌 [Plugin] Loaded: ${metadata.name} v${metadata.version}`);
      } catch (error) {
        logger.error(`❌ [Plugin] Failed to load ${pluginName}: ${error.message}`);
      }
    }
  }

  static getInstalledPlugins() {
    const pluginDir = path.join(__dirname, '../plugins');
    if (!fs.existsSync(pluginDir)) return [];

    return fs.readdirSync(pluginDir).filter(f => {
      return fs.statSync(path.join(pluginDir, f)).isDirectory();
    }).map(name => {
      const configPath = path.join(pluginDir, name, 'plugin.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
      return { name, version: 'unknown' };
    });
  }
}

module.exports = PluginManager;
