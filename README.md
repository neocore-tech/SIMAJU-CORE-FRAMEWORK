# <p align="center">SIMAJU Core Framework</p>

<p align="center">
  <strong>SIMAJU Core Framework + SIMAJU Guard (Rust Firewall)</strong><br>
  <em>The Advanced Agentic Coding Framework for Modern Backend Applications</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/architecture-modular-success.svg" alt="Architecture">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node Support">
  <img src="https://img.shields.io/badge/rust-1.70+-orange.svg" alt="Rust Support">
</p>

---

## 🚀 Apa itu SIMAJU Core?

**SIMAJU Core** adalah framework Node.js berstandar korporasi dengan arsitektur **Ultra-Lightweight Modular**. Framework utama sengaja dibuat sangat ringan dan hanya berisi modul esensial.

Kini dilengkapi dengan **SIMAJU Guard**, sebuah Reverse Proxy & Firewall berbasis **Rust** super cepat yang melindungi aplikasi dari serangan *DDoS*, *SQL Injection*, *XSS*, dan serangan *Brute Force*, memastikan performa dan keamanan tingkat tinggi.

---

## ✨ Fitur Unggulan

*   🛡️ **SIMAJU Guard (Rust Firewall)**: Dilengkapi dengan proteksi Layer 7 bawaan (Rate Limiter, IP Blacklist, Payload Analyzer).
*   📦 **Sparse-Checkout Modular System**: Pasang hanya modul bisnis yang Anda butuhkan (CRM, Inventory, dll) langsung dari Cloud Monorepo.
*   🔌 **Dynamic Discovery**: Router dan Plugin Manager 100% dinamis. Cukup masukkan folder modul dan framework akan mendeteksinya otomatis.
*   🛠️ **CLI Interaktif yang Sangat Mudah**: Menggunakan perintah `./mji` yang dirancang agar nyaman digunakan oleh pemula sekalipun.
*   💾 **Multi-DB Support**: Mendukung SQLite, MySQL, dan PostgreSQL dengan ORM & Query Builder bawaan.

---

## 🛠️ Instalasi Cepat

### 1. Kloning Repository
```bash
git clone https://github.com/neocore-tech/SIMAJU-CORE-FRAMEWORK.git
cd SIMAJU-CORE-FRAMEWORK
```

### 2. Install Dependencies
Cukup gunakan satu perintah ini untuk menginstal semua kebutuhan Node.js:
```bash
./mji install
```

### 3. Setup Database & Data Awal
Jalankan migrasi untuk membuat tabel-tabel di database, dan masukkan data awal (seeder):
```bash
./mji migrate
./mji seed
```

---

## 💻 Cara Menjalankan (Sangat Mudah!)

Lupakan perintah `npm` yang panjang dan rumit. Kami menyediakan antarmuka `./mji` yang sangat ramah pengguna. 

Terdapat 3 cara utama menjalankan sistem ini:

### Cara 1: Menjalankan Semuanya (Sangat Direkomendasikan) 🚀
```bash
./mji up
```
*Perintah ini akan menjalankan **Framework (Node.js)** di port 3000 dan **Firewall (Rust)** di port 8080 secara bersamaan. Aplikasi Anda otomatis terlindungi sepenuhnya.*

### Cara 2: Menjalankan Framework Saja (Development) 💻
```bash
./mji dev
```
*Hanya menjalankan core Node.js. Cocok saat Anda sedang asyik menulis kode modul.*

### Cara 3: Menjalankan Firewall Saja 🛡️
```bash
./mji guard
```
*Hanya menjalankan SIMAJU Guard (Rust). Biasa digunakan jika Anda mendeploy Framework dan Firewall di server yang berbeda (Microservices).*

---

## ⚙️ Perintah Utility Lainnya

Anda bisa melihat semua bantuan perintah dengan mengetik:
```bash
./mji help
```

Beberapa perintah yang sering digunakan:
- `./mji monit` — Membuka Terminal Dashboard interaktif (melihat CPU, RAM, Network).
- `./mji test` — Menjalankan unit testing dan validasi API.
- `./mji rollback` — Membatalkan (undo) perubahan database terakhir.

---

## 📁 Struktur Folder Utama

```text
SIMAJU-CORE-FRAMEWORK/
├── src/          # Source Code utama (Node.js)
├── guard/        # SIMAJU Guard Firewall (Rust)
├── public/       # File statis (Gambar, CSS, Welcome Page)
├── api/          # Entry point untuk API eksternal
├── tests/        # Script testing otomatis
└── mji           # Alat ajaib untuk menjalankan segalanya
```

---
<p align="center">Built with ❤️ by <b>SIMAJU Core Team</b></p>
