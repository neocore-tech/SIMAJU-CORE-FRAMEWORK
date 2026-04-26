'use strict';

const DB = require('../../database');

class PaymentService {
  async createInvoice(saleId, amount, method) {
    const result = await DB.table('payments').insert({
      sale_id: saleId,
      amount,
      method,
      status: 'pending',
      invoice_no: `INV-PAY-${Date.now()}`,
      created_at: new Date()
    });
    return { id: result.insertId || result._id, status: 'pending' };
  }

  async updateStatus(paymentId, status) {
    await DB.table('payments').where('id', paymentId).update({
      status,
      updated_at: new Date()
    });
    return true;
  }
}

module.exports = new PaymentService();
