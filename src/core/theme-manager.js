'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class ThemeManager {
  constructor() {
    this.themesPath       = path.join(__dirname, '../themes');
    // Lapisan aplikasi views — seperti resources/views/ di Laravel
    this.defaultViewsPath = path.join(__dirname, '../../resources/views');
    // Halaman welcome/docs — opsional, bisa disable via APP_WELCOME=false
    this.welcomePath      = path.join(__dirname, '../../welcome');
  }

  /**
   * Get list of all installed themes
   */
  getInstalledThemes() {
    if (!fs.existsSync(this.themesPath)) return [];
    
    return fs.readdirSync(this.themesPath)
      .filter(f => fs.statSync(path.join(this.themesPath, f)).isDirectory())
      .map(dir => {
        const configPath = path.join(this.themesPath, dir, 'theme.json');
        if (fs.existsSync(configPath)) {
          try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return { id: dir, ...config };
          } catch (e) {
            return { id: dir, name: dir, error: 'Invalid theme.json' };
          }
        }
        return { id: dir, name: dir };
      });
  }

  /**
   * Get active theme name from environment
   */
  getActiveTheme() {
    return process.env.APP_THEME || null;
  }

  /**
   * Get view paths for Express
   * Returns [activeThemeViews, defaultViews]
   */
  getViewPaths() {
    const active = this.getActiveTheme();
    const paths = [this.defaultViewsPath];

    if (active) {
      const themeViewsPath = path.join(this.themesPath, active, 'views');
      if (fs.existsSync(themeViewsPath)) {
        // Active theme views come first to allow overriding
        paths.unshift(themeViewsPath);
      }
    }

    return paths;
  }

  /**
   * Get static assets path for the active theme
   */
  getThemePublicPath() {
    const active = this.getActiveTheme();
    if (!active) return null;

    const themePublicPath = path.join(this.themesPath, active, 'public');
    return fs.existsSync(themePublicPath) ? themePublicPath : null;
  }

  /**
   * Activate a theme by updating .env
   */
  activate(name) {
    const themePath = path.join(this.themesPath, name);
    if (!fs.existsSync(themePath)) {
      throw new Error(`Theme [${name}] not found`);
    }

    const envPath = path.join(__dirname, '../../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('APP_THEME=')) {
        envContent = envContent.replace(/APP_THEME=.*/, `APP_THEME=${name}`);
      } else {
        envContent += `\nAPP_THEME=${name}`;
      }
    } else {
      envContent = `APP_THEME=${name}`;
    }

    fs.writeFileSync(envPath, envContent);
    // Update process.env for current session
    process.env.APP_THEME = name;
    return true;
  }
}

module.exports = new ThemeManager();
