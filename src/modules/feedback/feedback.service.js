'use strict';

const DB = require('../../database');

/**
 * Feedback Service (Bab 25)
 * ─────────────────────────────────────────────────────────────
 */
class FeedbackService {
  async submit(userId, data) {
    const { target_type, target_id, rating, comment } = data;
    
    const result = await DB.table('feedbacks').insert({
      user_id: userId,
      target_type, // 'product', 'order', 'app'
      target_id,
      rating,
      comment,
      created_at: new Date()
    });

    return { id: result.insertId || result._id };
  }

  async getForTarget(targetType, targetId) {
    return DB.table('feedbacks')
      .where('target_type', targetType)
      .where('target_id', targetId)
      .orderBy('created_at', 'DESC')
      .get();
  }
}

module.exports = new FeedbackService();
