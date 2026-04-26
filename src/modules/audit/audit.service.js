'use strict';

const DB = require('../../database');

/**
 * Audit Service (Bab 21)
 * ─────────────────────────────────────────────────────────────
 * Mencatat perubahan data mendalam (Before vs After).
 */
class AuditService {
  /**
   * Log perubahan data
   */
  async log(userId, moduleName, recordId, action, dataBefore, dataAfter) {
    await DB.table('audit_trails').insert({
      user_id: userId,
      module_name: moduleName,
      record_id: recordId,
      action, // 'create', 'update', 'delete'
      data_before: dataBefore ? JSON.stringify(dataBefore) : null,
      data_after: dataAfter ? JSON.stringify(dataAfter) : null,
      ip_address: null, // bisa di-pass dari controller
      created_at: new Date()
    });
  }

  /**
   * Ambil history audit untuk record tertentu
   */
  async getHistory(moduleName, recordId) {
    return DB.table('audit_trails')
      .where('module_name', moduleName)
      .where('record_id', recordId)
      .orderBy('created_at', 'DESC')
      .get();
  }
}

module.exports = new AuditService();
