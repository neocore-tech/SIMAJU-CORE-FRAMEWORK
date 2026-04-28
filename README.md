# <p align="center">Simaju Core Framework</p>

<p align="center">
  <strong>Simaju Core Framework</strong><br>
  <em>The Advanced Agentic Coding Framework for Modern Backend Applications</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/architecture-modular_sparse_checkout-success.svg" alt="Architecture">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node Support">
</p>

---

## 🚀 Apa itu Simaju Core?

**Simaju Core** telah berevolusi menjadi framework berstandar korporasi dengan arsitektur **Ultra-Lightweight Modular**. Framework utama sengaja dibuat sangat ringan dan hanya berisi modul-modul esensial (*Auth*, *User*, *Role*). 

Seluruh modul bisnis ekstensi (CRM, Inventory, CMS, dll) dikelola di sebuah **Monorepo Cloud** yang bisa di-*download* secara selektif menggunakan teknologi **Git Sparse-Checkout** layaknya menggunakan `npm` atau `composer`.

## ✨ Fitur Unggulan V2

*   📦 **Sparse-Checkout Modular System**: Pasang hanya modul bisnis yang Anda butuhkan langsung dari Cloud Monorepo tanpa membebani sistem Anda.
*   🔌 **Dynamic Discovery**: Router dan Plugin Manager sekarang 100% dinamis. Cukup masukkan folder modul ke `src/modules/` dan framework akan mendeteksinya otomatis tanpa registrasi manual.
*   🛠️ **Powerful Bulk Installer**: Atur infrastruktur Anda di `simaju.json` dan instal seluruh ekosistem dengan satu baris perintah.
*   💾 **Multi-DB Support**: Mendukung SQLite, MySQL, dan PostgreSQL dengan migrasi terpadu.
*   🎨 **Premium UI Dashboard**: Dilengkapi sistem Tema (Theme Engine) berbasis EJS yang sepenuhnya bisa dikustomisasi (*overrideable*).

## 🛠️ Instalasi Cepat

### 1. Kloning Core Framework
```bash
git clone https://github.com/neocore-tech/SIMAJU-CORE-FRAMEWORK.git
cd SIMAJU-CORE-FRAMEWORK
```

### 2. Konfigurasi Instalasi Modul (`simaju.json`)
Atur modul bisnis apa saja yang ingin Anda pasang di file `simaju.json`:
```json
{
  "registry": {
    "modules": "https://github.com/neocore-tech/simaju-modules-collection.git"
  },
  "modules": [
    "crm",
    "inventory"
  ]
}
```

### 3. Eksekusi Instalasi Otomatis
```bash
./simaju install:all
```
*Sistem akan otomatis mengekstrak spesifik folder `crm` dan `inventory` secara gaib dari repository utama.*

### 4. Mulai Server
```bash
./simaju db:migrate
npm run dev
```

## 📚 Boilerplate Templates
Kami juga menyediakan template dasar jika Anda ingin membuat ekstensi sendiri:
- [Module Template](https://github.com/neocore-tech/simaju-module-template)
- [Plugin Template](https://github.com/neocore-tech/simaju-plugin-template)
- [Theme Template](https://github.com/neocore-tech/simaju-theme-template)

---
<p align="center">Built with ❤️ by <b>Simaju Core Team</b></p>
