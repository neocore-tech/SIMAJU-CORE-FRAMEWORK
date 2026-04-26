'use strict';

const bcrypt = require('bcryptjs');

/**
 * Hashing Utility
 * ─────────────────────────────────────────────────────────────
 */
class Hash {
  /**
   * Hash a string
   * @param {string} value
   * @returns {Promise<string>}
   */
  static async make(value) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(value, salt);
  }

  /**
   * Check string against hash
   * @param {string} value
   * @param {string} hashedValue
   * @returns {Promise<boolean>}
   */
  static async check(value, hashedValue) {
    return bcrypt.compare(value, hashedValue);
  }
}

module.exports = Hash;
