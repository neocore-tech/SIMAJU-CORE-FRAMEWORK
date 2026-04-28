'use strict';

class SlugService {
  /**
   * Mengubah teks menjadi format URL-friendly (slug)
   * Contoh: "Berita Hari Ini! 2026" -> "berita-hari-ini-2026"
   */
  generate(text) {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Ganti spasi dengan -
      .replace(/[^\w\-]+/g, '')       // Hapus karakter non-word
      .replace(/\-\-+/g, '-')         // Ganti multiple - dengan single -
      .replace(/^-+/, '')             // Trim - dari depan
      .replace(/-+$/, '');            // Trim - dari belakang
  }

  /**
   * Menambahkan angka acak di belakang jika slug sudah ada
   * Berguna untuk menghindari URL duplikat
   */
  generateUnique(text, suffixLength = 4) {
    const baseSlug = this.generate(text);
    const suffix = Math.floor(Math.random() * Math.pow(10, suffixLength)).toString().padStart(suffixLength, '0');
    return `${baseSlug}-${suffix}`;
  }
}

module.exports = new SlugService();
