'use strict';

const DB = require('../../database');
const fs = require('fs').promises;
const path = require('path');

/**
 * File Management Service (Bab 18)
 * ─────────────────────────────────────────────────────────────
 */
class FileService {
  /**
   * Simpan metadata file ke DB
   */
  async registerFile(userId, fileData, tags = []) {
    const { filename, originalname, mimetype, size, path: filePath } = fileData;
    
    const result = await DB.table('files').insert({
      user_id: userId,
      filename,
      original_name: originalname,
      mime_type: mimetype,
      file_size: size,
      file_path: filePath,
      tags: JSON.stringify(tags),
      created_at: new Date()
    });

    return { id: result.insertId || result._id };
  }

  /**
   * Hapus file secara fisik dan dari DB
   */
  async deleteFile(fileId) {
    const file = await DB.table('files').where('id', fileId).first();
    if (file) {
      // Hapus fisik
      try {
        await fs.unlink(path.resolve(file.file_path));
      } catch (err) {
        // Abaikan jika file tidak ada
      }
      // Hapus DB
      await DB.table('files').where('id', fileId).delete();
    }
    return true;
  }

  /**
   * List file dengan filter tag
   */
  async listFiles(userId, tag = null) {
    let query = DB.table('files').where('user_id', userId);
    if (tag) {
      query = query.where('tags', 'LIKE', `%${tag}%`);
    }
    return query.orderBy('created_at', 'DESC').get();
  }
}

module.exports = new FileService();
