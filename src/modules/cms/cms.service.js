'use strict';

const DB = require('../../database');

/**
 * CMS Service (Bab 30)
 * ─────────────────────────────────────────────────────────────
 * Mengelola konten (Artikel, Blog, Halaman Statis).
 */
class CMSService {
  async getPosts(type = 'post') {
    return DB.table('cms_posts').where('type', type).where('status', 'published').get();
  }

  async createPost(userId, data) {
    const { title, content, type, category_id, tags, featured_image } = data;
    
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const result = await DB.table('cms_posts').insert({
      author_id: userId,
      title,
      slug,
      content,
      type: type || 'post',
      category_id,
      tags: JSON.stringify(tags),
      featured_image,
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date()
    });

    return { id: result.insertId || result._id, slug };
  }

  async publish(postId) {
    await DB.table('cms_posts').where('id', postId).update({
      status: 'published',
      published_at: new Date()
    });
    return true;
  }
}

module.exports = new CMSService();
