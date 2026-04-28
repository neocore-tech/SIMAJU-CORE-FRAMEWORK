'use strict';

/**
 * Validators — Common Validation Helpers
 * ─────────────────────────────────────────────────────────────
 * Digunakan oleh semua module untuk validasi input.
 * Setiap validator mengembalikan true (valid) atau string pesan error.
 */

const validators = {

  // ── Required ──────────────────────────────────────────────
  isRequired(value, fieldName = 'Field') {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} is required`;
    }
    return true;
  },

  // ── String ────────────────────────────────────────────────
  isString(value, fieldName = 'Field') {
    if (typeof value !== 'string') {
      return `${fieldName} must be a string`;
    }
    return true;
  },

  minLength(value, min, fieldName = 'Field') {
    if (typeof value !== 'string' || value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return true;
  },

  maxLength(value, max, fieldName = 'Field') {
    if (typeof value !== 'string' || value.length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return true;
  },

  // ── Email ─────────────────────────────────────────────────
  isEmail(value, fieldName = 'Field') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return true;
  },

  // ── Number ────────────────────────────────────────────────
  isNumeric(value, fieldName = 'Field') {
    if (isNaN(Number(value))) {
      return `${fieldName} must be a number`;
    }
    return true;
  },

  isPositive(value, fieldName = 'Field') {
    if (isNaN(Number(value)) || Number(value) <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return true;
  },

  isInteger(value, fieldName = 'Field') {
    if (!Number.isInteger(Number(value))) {
      return `${fieldName} must be an integer`;
    }
    return true;
  },

  // ── Boolean ───────────────────────────────────────────────
  isBoolean(value, fieldName = 'Field') {
    if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
      return `${fieldName} must be a boolean`;
    }
    return true;
  },

  // ── Enum ──────────────────────────────────────────────────
  isIn(value, allowedValues, fieldName = 'Field') {
    if (!allowedValues.includes(value)) {
      return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
    }
    return true;
  },

  // ── Date ──────────────────────────────────────────────────
  isDate(value, fieldName = 'Field') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`;
    }
    return true;
  },

  // ── URL ───────────────────────────────────────────────────
  isUrl(value, fieldName = 'Field') {
    try {
      new URL(value);
      return true;
    } catch {
      return `${fieldName} must be a valid URL`;
    }
  },

  // ── Password ──────────────────────────────────────────────
  isStrongPassword(value, fieldName = 'Password') {
    if (typeof value !== 'string' || value.length < 8) {
      return `${fieldName} must be at least 8 characters`;
    }
    if (!/[A-Z]/.test(value)) {
      return `${fieldName} must contain at least one uppercase letter`;
    }
    if (!/[0-9]/.test(value)) {
      return `${fieldName} must contain at least one number`;
    }
    return true;
  },

  // ── Schema Validator ──────────────────────────────────────
  /**
   * Validasi object berdasarkan schema rules.
   * @param {Object} data - data yang akan divalidasi
   * @param {Object} rules - { fieldName: [fn1, fn2, ...] }
   * @returns {{ valid: boolean, errors: Object }}
   *
   * @example
   * const { valid, errors } = validate(req.body, {
   *   email:    [v => isRequired(v, 'Email'), v => isEmail(v, 'Email')],
   *   password: [v => isRequired(v, 'Password'), v => minLength(v, 8, 'Password')],
   * });
   */
  validate(data, rules) {
    const errors = {};

    for (const [field, ruleFns] of Object.entries(rules)) {
      for (const ruleFn of ruleFns) {
        const result = ruleFn(data[field]);
        if (result !== true) {
          errors[field] = result;
          break; // stop at first error per field
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

module.exports = validators;
