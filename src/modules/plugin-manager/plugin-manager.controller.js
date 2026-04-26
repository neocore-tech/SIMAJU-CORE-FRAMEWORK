'use strict';

const PluginManager = require('../../core/plugin-manager');
const Response = require('../../utils/response');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class PluginAdminController {
  /**
   * List all installed plugins
   */
  static async index(req, res) {
    try {
      const plugins = PluginManager.getInstalledPlugins();
      console.log(`[PluginAdmin] Fetched ${plugins.length} plugins`);
      return Response.success(res, plugins, 'Plugins fetched successfully');
    } catch (error) {
      return Response.error(res, error.message);
    }
  }

  /**
   * Install a new plugin via Git
   */
  static async install(req, res) {
    const { url } = req.body;
    if (!url) return Response.error(res, 'Git URL is required', 400);

    try {
      const pluginName = path.basename(url, '.git');
      const targetPath = path.join(__dirname, '../../plugins', pluginName);

      if (fs.existsSync(targetPath)) {
        return Response.error(res, `Plugin [${pluginName}] already exists`, 400);
      }

      // Execute git clone
      const result = spawnSync('git', ['clone', url, targetPath]);

      if (result.status === 0) {
        return Response.success(res, `Plugin [${pluginName}] installed successfully. Restart server to activate.`);
      } else {
        return Response.error(res, `Failed to clone plugin: ${result.stderr.toString()}`);
      }
    } catch (error) {
      return Response.error(res, error.message);
    }
  }
}

module.exports = PluginAdminController;
