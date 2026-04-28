'use strict';

class ContentSeoService {
  /**
   * Menghitung Keyword Density (Kepadatan Kata Kunci)
   * Idealnya 1% - 3%
   */
  calculateKeywordDensity(text, targetKeyword) {
    if (!text || !targetKeyword) return { count: 0, isOptimal: false };

    // Bersihkan HTML tags
    const plainText = text.replace(/<[^>]*>?/gm, '').toLowerCase();
    const keyword = targetKeyword.toLowerCase();
    
    const words = plainText.split(/\s+/).filter(w => w.length > 0).length;
    
    // Hitung kemunculan
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = plainText.match(regex);
    const count = matches ? matches.length : 0;

    const density = words > 0 ? (count / words) * 100 : 0;
    return {
      keyword,
      count,
      totalWords: words,
      densityPercentage: density.toFixed(2),
      isOptimal: density >= 1 && density <= 3
    };
  }

  /**
   * Memberikan skor SEO keseluruhan berdasarkan panjang teks, keyword, dsb
   */
  calculateSeoScore(text, targetKeyword, title) {
    let score = 0;
    const feedback = [];

    // 1. Cek panjang artikel
    const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(w => w.length > 0).length;
    if (words >= 300) {
      score += 30;
      feedback.push('Panjang konten sangat baik (Lebih dari 300 kata).');
    } else {
      feedback.push('Konten terlalu pendek. Disarankan lebih dari 300 kata.');
    }

    // 2. Cek judul
    if (title && targetKeyword && title.toLowerCase().includes(targetKeyword.toLowerCase())) {
      score += 30;
      feedback.push('Kata kunci utama ditemukan di dalam judul.');
    } else {
      feedback.push('Kata kunci utama tidak ditemukan di judul.');
    }

    // 3. Density
    const densityData = this.calculateKeywordDensity(text, targetKeyword);
    if (densityData.isOptimal) {
      score += 40;
      feedback.push('Kepadatan kata kunci optimal (1% - 3%).');
    } else {
      feedback.push(`Kepadatan kata kunci kurang ideal (${densityData.densityPercentage}%).`);
    }

    return { score, feedback, densityData };
  }
}

module.exports = new ContentSeoService();
