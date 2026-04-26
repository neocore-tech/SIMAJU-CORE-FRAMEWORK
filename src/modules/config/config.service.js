'use strict';

const DB = require('../../database');

class ConfigService {
  async getSettings() {
    const rows = await DB.table('settings').get();
    const config = {};
    rows.forEach(r => { config[r.key] = r.value; });
    return config;
  }

  async updateSettings(data) {
    for (const [key, value] of Object.entries(data)) {
      const existing = await DB.table('settings').where('key', key).first();
      if (existing) {
        await DB.table('settings').where('key', key).update({ value, updated_at: new Date() });
      } else {
        await DB.table('settings').insert({ key, value, created_at: new Date() });
      }
    }
    return this.getSettings();
  }

  /**
   * Default SEO Settings (Bab 9)
   */
  async getSEOSettings() {
    const settings = await this.getSettings();
    return {
      google_verification: settings.google_verification || '',
      bing_verification:   settings.bing_verification || '',
      google_analytics_id: settings.google_analytics_id || '',
      facebook_pixel_id:   settings.facebook_pixel_id || '',
      footer_scripts:      settings.footer_scripts || '',
    };
  }
}

module.exports = new ConfigService();
