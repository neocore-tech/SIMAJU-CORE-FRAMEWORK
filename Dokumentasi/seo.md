# 🚀 Panduan SEO Engine (SIMAJU Core)

Sistem SEO di dalam SIMAJU Core dirancang secara bertahap (Phase) untuk memastikan aplikasi Anda ramah terhadap mesin pencari (Google, Bing, dll) dan memiliki performa *Core Web Vitals* yang sangat baik.

Dokumentasi ini menjelaskan tahapan implementasi modul `/seo` dari fondasi dasar hingga sistem otomasi SEO tingkat lanjut.

---

## 🚀 PHASE 1 — Foundation (WAJIB HIDUP DULU)
**Goal:** Website bisa di-crawl & di-index dengan benar

### 🔧 Module Dasar
```text
src/seo/
 ├── meta.js      # Generate tag meta dinamis per halaman
 ├── robots.js    # Mengatur rule robots.txt
 ├── sitemap.js   # Generate sitemap.xml otomatis
 └── schema.js    # Schema JSON-LD dasar (Organization/Website)
```

### 🎯 Implementasi & Output
- **Meta Dinamis:** Setiap halaman memiliki `title`, `description`, dan `keywords` unik.
- **Output:** Seluruh halaman siap dibaca oleh Googlebot, Sitemap bisa diakses, dan tidak ada pemblokiran *crawling* yang salah.

---

## ⚡ PHASE 2 — Index Control & Struktur
**Goal:** Menghindari *duplicate content* dan merapikan struktur URL

### 🔧 Module Lanjutan
```text
src/seo/
 ├── canonical.js # Penanda canonical link
 ├── slug.js      # Generator slug URL yang SEO-friendly
 └── redirect.js  # Manajemen Redirect 301/302
```

### 🎯 Implementasi & Output
- **Canonical:** Mencegah Google bingung jika ada URL dengan parameter (contoh: `?page=2` atau `?source=fb`).
- **Redirect 301:** Sangat penting untuk menjaga *link juice* jika ada perubahan URL konten lama.
- **Output:** Tidak ada peringatan *Duplicate Content* di Google Search Console. URL rapi dan konsisten.

---

## 🔥 PHASE 3 — Rich Result & Visibility
**Goal:** Menaikkan *Click-Through Rate (CTR)* dan tampil menonjol (Rich Snippets) di hasil pencarian.

### 🔧 Upgrade Schema
```text
src/seo/schema/
 ├── Article.js
 ├── FAQ.js
 └── Breadcrumb.js
```

### 🎯 Implementasi & Output
- Menginjeksi `JSON-LD` otomatis berdasarkan tipe konten.
- **Output:** Halaman artikel bisa muncul dengan *thumbnail* di pencarian, FAQ muncul sebagai akordion di Google, navigasi *breadcrumb* terdeteksi dengan jelas.

---

## 🌐 PHASE 4 — Social & Sharing
**Goal:** Memastikan link website terlihat profesional saat dibagikan ke media sosial (WhatsApp, Facebook, Twitter, LinkedIn).

### 🔧 Module Social
```text
src/seo/
 ├── openGraph.js   # Untuk Facebook, WA, LinkedIn
 └── twitterCard.js # Khusus untuk Twitter/X
```

### 🎯 Implementasi & Output
- Menambahkan tag `og:title`, `og:image`, `twitter:card`, dll.
- Mendukung *Dynamic Thumbnail* (mengambil gambar pertama artikel sebagai *cover* link).
- **Output:** *Share link* menjadi kartu besar (*large image card*) yang menarik untuk di-klik.

---

## ⚡ PHASE 5 — Performance SEO
**Goal:** Skor *Core Web Vitals* bagus (Ranking Boost langsung dari Google)

### 🔧 Module Performa
```text
src/seo/
 ├── imageSeo.js    # Optimasi gambar
 └── performance.js # Minify dan struktur aset
```

### 🎯 Implementasi & Output
- **Image:** Implementasi `loading="lazy"`, atribut `alt` otomatis, dan konversi ke format `WebP`.
- **Output:** Page Speed Insights skor naik drastis. LCP (Largest Contentful Paint) dan CLS (Cumulative Layout Shift) berada di zona hijau (Aman).

---

## 🧠 PHASE 6 — Internal SEO Engine
**Goal:** Memperkuat arsitektur konten secara internal agar *Bounce Rate* turun.

### 🔧 Module Arsitektur Konten
```text
src/seo/
 ├── internalLink.js # Auto-linking kata kunci tertentu
 └── contentSeo.js   # Analisis densitas keyword
```

### 🎯 Implementasi & Output
- **Auto Internal Linking:** Jika ada kata "SIMAJU", otomatis diberi *link* ke halaman *About*.
- Menyediakan artikel terkait (*Related Posts*) yang benar-benar relevan secara semantik.
- **Output:** Pengunjung lebih lama berada di web (*Session Duration* naik).

---

## 🤖 PHASE 7 — Automation System
**Goal:** SEO berjalan dengan sendirinya (Auto-Pilot) tanpa input manual dari Admin.

### 🔧 Module Otomasi
```text
src/seo/
 ├── autoMeta.js    # Ekstrak deskripsi dari paragraf pertama
 ├── autoSchema.js  # Deteksi struktur secara pintar
 └── autoSitemap.js # Ping ke Google tiap kali ada artikel baru
```

### 🎯 Implementasi & Output
- Menghapus beban *Content Writer* untuk selalu mengisi meta.
- *Sitemap* otomatis ter-*update* ke Google dalam hitungan detik setelah di-*publish*.
- **Output:** Skalabilitas konten tanpa hambatan teknis.

---

## 📊 PHASE 8 — Monitoring & Tools
**Goal:** Mengetahui "Kesehatan" SEO website langsung dari dalam framework.

### 🔧 Module Monitoring
```text
src/seo/
 ├── seoLogger.js # Catat 404 (Broken Links)
 └── crawler.js   # Cek index status
```

### 🎯 Implementasi & Output
- Melacak jika ada *Broken Link* yang dihasilkan oleh user/admin.
- **Output:** Anda tahu persis apa masalah SEO Anda sebelum Google menurunkan *ranking* Anda.

---

## 🧱 FINAL STRUKTUR MODULE `/seo` (Production Ready)

Berikut adalah wujud akhir struktur direktori mesin SEO kita di dalam `src/seo/`:

```text
src/seo/
 ├── meta.js
 ├── robots.js
 ├── sitemap.js
 ├── schema.js
 ├── canonical.js
 ├── slug.js
 ├── redirect.js
 ├── openGraph.js
 ├── twitterCard.js
 ├── imageSeo.js
 ├── performance.js
 ├── internalLink.js
 ├── contentSeo.js
 ├── autoMeta.js
 ├── autoSchema.js
 ├── autoSitemap.js
 ├── seoLogger.js
 └── crawler.js
```

---

## 🎯 PRIORITAS RILIS (Bila Waktu Terbatas)

Jika aplikasi harus rilis dalam waktu dekat, fokus pada tahapan ini terlebih dahulu:
1. **Phase 1** (Wajib Mutlak)
2. **Phase 2** (Sangat Wajib - Mencegah *Duplicate Content*)
3. **Phase 3** (High Impact - Rich Snippet)
4. **Phase 5** (Ranking Boost lewat Kecepatan)

> [!TIP]
> **Tips Nyata di Lapangan:**
> Banyak developer hanya berhenti di pembuatan *Sitemap* dan *Meta tag*. Padahal, untuk mendominasi Google di tahun 2024+, kekuatan sebenarnya berada di **Internal Linking**, **Schema JSON-LD**, dan **Performa Web Vitals**. Pastikan Anda mengimplementasikan Phase 3, 5, dan 6!
