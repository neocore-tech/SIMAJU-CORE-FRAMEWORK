'use strict';

/**
 * i18n Utility (Bab 23)
 * ─────────────────────────────────────────────────────────────
 */
const locales = {
  id: {
    welcome: 'Selamat Datang',
    login_success: 'Login Berhasil'
  },
  en: {
    welcome: 'Welcome',
    login_success: 'Login Successful'
  }
};

class I18n {
  static translate(key, locale = 'id') {
    return locales[locale]?.[key] || key;
  }
}

module.exports = I18n;
