# Hello World Plugin 🌍

Plugin contoh dasar untuk mendemonstrasikan cara kerja sistem plugin di **Simaju Core Framework**.

## 🚀 Deskripsi
Plugin ini menambahkan rute API sederhana `/api/hello-world` yang mengembalikan pesan sambutan. Ini adalah referensi terbaik bagi developer yang ingin mulai membangun plugin mereka sendiri.

## 🛠️ Cara Penggunaan
Setelah plugin ini terpasang (biasanya melalui `./simaju plugin:install`), ia akan otomatis dimuat oleh Core.

1. Jalankan migrasi jika ada:
   ```bash
   ./simaju plugin:migrate hello-world
   ```
2. Akses melalui API:
   `GET http://localhost:3000/api/hello-world`

## 📂 Struktur Folder
*   `plugin.json`: Metadata plugin (nama, versi, author).
*   `index.js`: Titik masuk utama plugin.
*   `routes.js`: Definisi rute plugin.

---
Part of **Simaju Core Ecosystem**
