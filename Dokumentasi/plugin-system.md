# 🔌 Sistem Plugin Simaju Core

Sistem Plugin memungkinkan Anda untuk memperluas fungsionalitas framework tanpa memodifikasi kode inti. Setiap plugin bersifat independen dan dapat didistribusikan dengan mudah.

---

## 📂 Struktur Folder Plugin
Setiap plugin harus diletakkan di dalam direktori `src/plugins/[nama-plugin]/` dengan struktur sebagai berikut:

```text
src/plugins/[nama-plugin]/
├── plugin.json      # Metadata plugin (Wajib)
├── routes.js        # Definisi rute API (Opsional)
├── index.js         # Logika inisialisasi boot (Opsional)
└── migrations/      # Skema database khusus plugin (Opsional)
```

---

## 📝 1. Metadata (`plugin.json`)
File ini mendefinisikan identitas plugin Anda.

```json
{
  "name": "Nama Plugin Anda",
  "version": "1.0.0",
  "description": "Deskripsi singkat fungsi plugin.",
  "author": "Nama Anda"
}
```

---

## 🛣️ 2. Perutean Otomatis (`routes.js`)
Jika file ini ada, Simaju akan otomatis mendaftarkannya dengan prefix `/api/plugins/[nama-folder]/`.

```javascript
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Hello from Plugin!' });
});

module.exports = router;
```
*Akses di: `GET /api/plugins/[nama-plugin]/test`*

---

## ⚙️ 3. Inisialisasi Boot (`index.js`)
Gunakan file ini jika plugin Anda membutuhkan logika yang dijalankan saat server pertama kali menyala (seperti mendaftarkan event listener atau middleware global).

```javascript
module.exports = async (app) => {
  console.log('Plugin ini sedang diinisialisasi...');
  // Tambahkan logika boot di sini
};
```

---

## 🛠️ 4. Perintah CLI
Simaju menyediakan perintah khusus untuk mengelola plugin:

- **Melihat Daftar**: `./simaju plugin:list`
- **Instal dari Git**: `./simaju plugin:install <git-url>`

---

## 💡 Tips Pengembangan
1. **Gunakan Logger**: Gunakan `const logger = require('../../utils/logger')` agar log plugin Anda muncul di sistem logging pusat.
2. **Keamanan**: Selalu gunakan middleware `auth` jika rute plugin Anda bersifat sensitif.
3. **Database (Raw SQL)**: Karena Simaju Core menggunakan abstraksi driver minimal, gunakan `await DB.raw()` di dalam file migrasi plugin Anda untuk kompatibilitas maksimal.

---

✅ **Sistem Plugin membuat Simaju Core menjadi framework yang tidak terbatas!**
