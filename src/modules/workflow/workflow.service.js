'use strict';

const DB = require('../../database');

/**
 * Workflow Service (Bab 29)
 * ─────────────────────────────────────────────────────────────
 * Mengelola step-step approval untuk transaksi.
 */
class WorkflowService {
  /**
   * Inisialisasi workflow untuk sebuah transaksi
   */
  async start(moduleName, recordId, workflowType) {
    // Ambil konfigurasi workflow
    const steps = await DB.table('workflow_configs')
      .where('type', workflowType)
      .orderBy('step_order', 'ASC')
      .get();

    if (steps.length > 0) {
      // Set status awal
      await DB.table(moduleName).where('id', recordId).update({
        workflow_status: 'pending_approval',
        current_step: steps[0].id
      });

      // Buat log workflow
      await DB.table('workflow_logs').insert({
        module_name: moduleName,
        record_id: recordId,
        step_id: steps[0].id,
        status: 'pending',
        created_at: new Date()
      });
    }
  }

  /**
   * Approve / Reject sebuah step
   */
  async process(logId, userId, action, comment) {
    const log = await DB.table('workflow_logs').where('id', logId).first();
    if (!log) throw new Error('Workflow log not found');

    await DB.table('workflow_logs').where('id', logId).update({
      status: action, // 'approved' or 'rejected'
      approver_id: userId,
      comment,
      processed_at: new Date()
    });

    // Jika approved, lanjut ke step berikutnya
    if (action === 'approved') {
      const nextStep = await DB.table('workflow_configs')
        .where('type', log.workflow_type)
        .where('step_order', '>', log.step_order)
        .orderBy('step_order', 'ASC')
        .first();

      if (nextStep) {
        // Update record ke step berikutnya
        await DB.table(log.module_name).where('id', log.record_id).update({
          current_step: nextStep.id
        });
        
        // Buat log baru untuk step berikutnya
        await DB.table('workflow_logs').insert({
          module_name: log.module_name,
          record_id: log.record_id,
          step_id: nextStep.id,
          status: 'pending',
          created_at: new Date()
        });
      } else {
        // Workflow Selesai
        await DB.table(log.module_name).where('id', log.record_id).update({
          workflow_status: 'completed'
        });
      }
    } else {
      // Jika Rejected
      await DB.table(log.module_name).where('id', log.record_id).update({
        workflow_status: 'rejected'
      });
    }
  }
}

module.exports = new WorkflowService();
