# <p align="center">SIMAJU Core Framework</p>

<p align="center">
  <strong>SIMAJU Core Framework + SIMAJU Guard (Rust Firewall)</strong><br>
  <em>The Modern Modular Backend Framework — Built for SaaS, Enterprise & Developers</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/architecture-modular-success.svg" alt="Architecture">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node Support">
  <img src="https://img.shields.io/badge/rust-1.70+-orange.svg" alt="Rust Support">
  <img src="https://img.shields.io/badge/install-npx create--simaju--app-blueviolet.svg" alt="Install">
</p>

---

## 🚀 Apa itu SIMAJU Core?

**SIMAJU Core** adalah framework backend modern dengan arsitektur **Ultra-Lightweight Modular**. Framework utama sengaja dibuat sangat ringan dan hanya berisi modul esensial — semua fitur bisnis dipasang terpisah melalui sistem modul dan plugin.

Kini dilengkapi dengan **SIMAJU Guard**, sebuah Reverse Proxy & Firewall berbasis **Rust** super cepat yang melindungi aplikasi dari serangan *DDoS*, *SQL Injection*, *XSS*, dan serangan *Brute Force*, memastikan performa dan keamanan tingkat tinggi.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| 🛡️ **SIMAJU Guard** | Rust Firewall bawaan: Rate Limiter, IP Blacklist, WAF, Brute Force Protection |
| 📦 **Modular System** | Pasang hanya modul bisnis yang dibutuhkan — tidak ada bloat |
| 🔌 **Dynamic Discovery** | Router & Plugin Manager 100% otomatis terdeteksi |
| 🛠️ **CLI `mji`** | Perintah artisan-like yang sangat mudah digunakan |
| 💾 **Multi-DB Support** | SQLite, MySQL, PostgreSQL, MongoDB — Database Agnostic |
| 🔐 **Auto Secret Keygen** | Kunci JWT & Admin Key di-generate unik per proyek secara otomatis |
| 🌐 **SEO Engine** | Meta dinamis, Sitemap, Schema JSON-LD, dan Redirect 301 bawaan |

---

## ⚡ Instalasi Otomatis (Direkomendasikan)

> **Prasyarat:** Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) versi 18 atau lebih baru dan [Git](https://git-scm.com/).

Cukup satu perintah untuk memulai. Proses berikut akan berjalan **sepenuhnya otomatis**:

```bash
npx create-simaju-app nama-proyek-anda
```

### Yang terjadi secara otomatis di balik layar:
1. ✅ Framework ter-*clone* dari GitHub ke folder proyek Anda
2. ✅ Riwayat git lama dibersihkan & repositori git baru dibuat khusus untuk proyek Anda
3. ✅ Anda ditanya jenis database yang ingin digunakan (SQLite / MySQL / PostgreSQL)
4. ✅ File `.env` dibuat dari template dengan **JWT Secret & Admin Key yang benar-benar acak & unik**
5. ✅ Semua dependency NPM langsung terinstall

### Lanjutkan setelah instalasi:

```bash
# Masuk ke folder proyek
cd nama-proyek-anda

# Jalankan framework + firewall sekaligus
./mji up
```

> 💡 Jika menggunakan **SQLite**, semua siap langsung! Jika menggunakan **MySQL/PostgreSQL**, isi kredensial di file `.env` terlebih dahulu, lalu jalankan `./mji migrate`.

---

## 💻 Cara Menjalankan

SIMAJU Core menyediakan perintah `mji` sebagai pusat kontrol seluruh operasi framework Anda.

### Mode Utama

```bash
# 🚀 PALING DIREKOMENDASIKAN: Jalankan Framework + Firewall bersamaan
./mji up

# 💻 Mode Development (Framework Node.js saja)
./mji dev

# 🛡️ Firewall saja (untuk arsitektur microservices)
./mji guard
```

### Database

```bash
./mji migrate      # Jalankan semua migration
./mji seed         # Isi data awal (seeder)
./mji rollback     # Batalkan migration terakhir
```

### Scaffolding (Generate Kode Otomatis)

```bash
./mji make:module inventaris       # Buat modul baru
./mji make:migration create_users  # Buat file migration baru
```

### Monitoring & Testing

```bash
./mji monit   # Buka Terminal Dashboard (CPU, RAM, Network)
./mji test    # Jalankan unit testing & API testing
./mji help    # Tampilkan semua perintah yang tersedia
```

---

## 📁 Struktur Folder Utama

```text
nama-proyek-anda/
├── src/
│   ├── core/        # Engine inti framework (Router, Auth, DB, dll)
│   ├── modules/     # Modul bisnis Anda (Inventaris, CRM, dll)
│   ├── plugins/     # Plugin tambahan (Email, Payment Gateway, dll)
│   └── seo/         # SEO Engine (Meta, Sitemap, Schema)
├── guard/           # SIMAJU Guard Firewall (Rust)
│   └── guard.toml   # Konfigurasi firewall & WAF
├── resources/
│   └── views/       # Template Tema & Views (EJS)
├── public/          # Aset statis (CSS, JS, Gambar)
├── tests/           # Script unit & API testing
├── .env             # Konfigurasi environment (auto-generated)
├── simaju.json      # Daftar modul, plugin, dan tema aktif
└── mji              # CLI utama SIMAJU
```

---

## 🛡️ SIMAJU Guard — Firewall Berbasis Rust

Framework ini dilindungi oleh **SIMAJU Guard**, sebuah *reverse proxy* berperforma tinggi yang dibangun menggunakan Rust.

| Perlindungan | Detail |
|---|---|
| **WAF** | Mendeteksi & memblokir SQLi, XSS, Path Traversal, Command Injection |
| **Rate Limiter** | Token Bucket per IP, bisa dikonfigurasi per-rute |
| **Brute Force Lock** | Blokir otomatis setelah sejumlah percobaan login gagal |
| **IP Blacklist** | Auto-block IP penyerang secara dinamis |
| **Security Headers** | HSTS, X-Frame-Options, CSP, dll — injeksi otomatis |
| **TLS/HTTPS** | Dukungan sertifikat SSL/TLS nativ via `rustls` |
| **Admin API** | Kontrol firewall dari jarak jauh via REST API (port 9000) |

Konfigurasi lengkap firewall terdapat di file `guard/guard.toml`.

---

## 📚 Dokumentasi

Dokumentasi teknis lengkap tersedia di folder `Dokumentasi/`:

| File | Isi |
|---|---|
| `guide_module_development.md` | Cara membuat Modul bisnis baru (MVC) |
| `guide_plugin_development.md` | Cara membuat Plugin & hooking Event Bus |
| `guide_theme_development.md` | Cara membuat & mengaktifkan Tema (SSR) |
| `seo.md` | Panduan lengkap SEO Engine (8 Phase) |
| `firewall_guard.md` | Dokumentasi SIMAJU Guard |
| `architecture.md` | Arsitektur folder & alur kerja core |

---

## 🌐 Ekosistem SIMAJU

SIMAJU Core dirancang untuk diperluas. Temukan koleksi resmi modul, plugin, dan tema siap pakai di repositori berikut:

| Repositori | Isi | Link |
|---|---|---|
| **koleksi-modul-simaju** | Koleksi modul bisnis resmi (CRM, LMS, Inventaris, HRIS, dll) | [→ neocore-tech/koleksi-modul-simaju](https://github.com/neocore-tech/koleksi-modul-simaju) |
| **simaju-modul-templat** | Template scaffold resmi untuk membuat modul baru | [→ neocore-tech/simaju-modul-templat](https://github.com/neocore-tech/simaju-modul-templat) |
| **plugin-simaju** | Plugin integrasi pihak ketiga (Email, Payment, Analytics, dll) | [→ neocore-tech/plugin-simaju](https://github.com/neocore-tech/plugin-simaju) |
| **template-plugin-simaju** | Template scaffold resmi untuk membuat plugin baru | [→ neocore-tech/template-plugin-simaju](https://github.com/neocore-tech/template-plugin-simaju) |
| **template-tema-simaju** | Koleksi tema tampilan & template UI siap pakai (EJS) | [→ neocore-tech/template-tema-simaju](https://github.com/neocore-tech/template-tema-simaju) |

> 💡 Untuk memasang modul/plugin/tema, cukup daftarkan namanya di file `simaju.json` lalu jalankan `./mji install:all`.

---

## 📚 Dokumentasi

Dokumentasi teknis lengkap tersedia di folder `Dokumentasi/`:

| File | Isi |
|---|---|
| `guide_module_development.md` | Cara membuat Modul bisnis baru (MVC) |
| `guide_plugin_development.md` | Cara membuat Plugin & hooking Event Bus |
| `guide_theme_development.md` | Cara membuat & mengaktifkan Tema (SSR) |
| `seo.md` | Panduan lengkap SEO Engine (8 Phase) |
| `firewall_guard.md` | Dokumentasi SIMAJU Guard |
| `architecture.md` | Arsitektur folder & alur kerja core |

---

<p align="center">Built with ❤️ by <b>SIMAJU Core Team</b></p>
