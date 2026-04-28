# 📦 Panduan Pengembangan Module

Di dalam arsitektur **SIMAJU Core Framework**, sebuah **Module** adalah unit fungsionalitas terbesar. Modul berisi logika bisnis lengkap (seperti LMS, CRM, Billing) yang berjalan di dalam *core engine*.

Berbeda dengan *Plugin* yang biasanya hanya menempel/menyisipkan fungsi kecil, sebuah *Module* memiliki *Router*, *Controller*, *Service*, dan *Database Migration* sendiri.

---

## 1. Struktur Direktori Module

Setiap module harus diletakkan di dalam folder `src/modules/<nama_module>`. Berikut adalah standar strukturnya:

```text
src/modules/inventaris/
├── index.js                  # Entry point module (registrasi rute)
├── inventaris.controller.js  # Menangani HTTP request & response
├── inventaris.service.js     # Menangani logika bisnis & query database
├── inventaris.route.js       # Mendefinisikan endpoint API (Axios/Router)
└── /tests/                   # (Opsional) Unit test khusus module ini
```

---

## 2. Cara Membuat Module Baru

Anda tidak perlu membuat file secara manual. SIMAJU Core telah dilengkapi dengan alat CLI otomatis (Scaffolding) menggunakan perintah `mji`.

### Langkah 1: Generate Skeleton
Gunakan perintah CLI berikut di terminal Anda:
```bash
mji make:module inventaris
```
Perintah ini akan secara otomatis membuat folder `src/modules/inventaris` beserta seluruh kerangka file `.controller.js`, `.service.js`, dan `.route.js` yang sudah saling terhubung.

### Langkah 2: Registrasi Module (Otomatis)
Jika Anda menggunakan perintah `mji make:module`, module akan langsung terdeteksi otomatis oleh *auto-loader* di `src/core/app.js`.

Namun jika tidak terdeteksi, pastikan struktur `index.js` di dalam module Anda me-*return* rute dengan benar:

```javascript
// src/modules/inventaris/index.js
const inventarisRoute = require('./inventaris.route');

module.exports = {
  routes: inventarisRoute
};
```

---

## 3. Alur Kerja MVC (Model-Service-Controller)

Untuk menjaga kode tetap bersih (*Clean Architecture*), SIMAJU Core memisahkan logika ke dalam 3 lapisan utama:

### A. Route Layer (`.route.js`)
Hanya bertugas mendaftarkan URL dan *middleware* keamanan (contoh: autentikasi JWT).
```javascript
const router = require('express').Router();
const controller = require('./inventaris.controller');
const authMiddleware = require('../../core/middleware/auth.middleware');

router.get('/', authMiddleware, controller.getAllItems);
router.post('/', authMiddleware, controller.createItem);

module.exports = router;
```

### B. Controller Layer (`.controller.js`)
Hanya bertugas menangani Request (`req`) dan Response (`res`). **Dilarang** menulis *query database* atau logika bisnis rumit di sini.
```javascript
const service = require('./inventaris.service');

const getAllItems = async (req, res, next) => {
  try {
    const data = await service.fetchAllItems();
    res.json({ success: true, data });
  } catch (error) {
    next(error); // Lempar ke Error Handler Core
  }
};

module.exports = { getAllItems };
```

### C. Service Layer (`.service.js`)
Di sinilah seluruh logika bisnis dan interaksi dengan *Database Query Builder* diletakkan.
```javascript
const db = require('../../core/database');

const fetchAllItems = async () => {
  // Contoh menggunakan Knex Query Builder atau Sequelize
  return await db('inventaris_items').select('*').where('is_active', true);
};

module.exports = { fetchAllItems };
```

---

## 4. Keamanan Module

* **Gunakan Middleware Auth:** Pastikan setiap *endpoint* yang mengubah data (`POST`, `PUT`, `DELETE`) dilindungi oleh `authMiddleware`.
* **Gunakan Validasi:** Validasilah payload body menggunakan Joi atau Zod sebelum memproses data di dalam Service.
* **Hindari Hardcode:** Selalu gunakan Environment Variable (`process.env.VARIABLE_NAME`) untuk menyimpan *secret* pihak ketiga yang spesifik untuk modul Anda.
