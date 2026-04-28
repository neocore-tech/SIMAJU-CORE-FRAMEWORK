'use strict';

const db = require('../../../config/database');

class RedirectService {
  /**
   * Mencari apakah path/URL saat ini harus di-redirect ke URL baru
   */
  async findRedirect(currentPath) {
    try {
      const redirect = await db('seo_redirects')
        .where({ old_url: currentPath, is_active: true })
        .first();
      return redirect;
    } catch (error) {
      console.error('[SEO] Redirect Service Error:', error);
      return null;
    }
  }

  /**
   * Mendaftarkan redirect baru (berguna jika CMS post diubah slugnya)
   */
  async createRedirect(oldUrl, newUrl, statusCode = 301) {
    try {
      const existing = await db('seo_redirects').where({ old_url: oldUrl }).first();
      if (existing) {
        return await db('seo_redirects')
          .where({ id: existing.id })
          .update({ new_url: newUrl, status_code: statusCode, updated_at: db.fn.now() });
      }
      
      return await db('seo_redirects').insert({
        old_url: oldUrl,
        new_url: newUrl,
        status_code: statusCode
      });
    } catch (error) {
      console.error('[SEO] Failed to create redirect:', error);
      return false;
    }
  }
}

module.exports = new RedirectService();
