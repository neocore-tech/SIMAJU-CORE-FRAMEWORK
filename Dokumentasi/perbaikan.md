# SIMAJU Core Framework — Perbaikan Struktur Folder

> Dokumen ini membahas masalah struktur folder yang ada sekarang, kenapa bermasalah, dan bagaimana seharusnya.

---

## ✅ Yang Sudah Bagus (Jangan Diubah)

Struktur di dalam `src/` sudah solid dan konsisten:

* Pola `controller → service → route` diterapkan di semua modul
* Separation yang jelas antara `core/`, `database/`, `middlewares/`, `modules/`, `utils/`
* Dynamic module discovery sudah berjalan
* Driver abstraction untuk multi-DB sudah rapi

**Intinya: isi `src/` tidak perlu banyak diubah. Masalahnya ada di luar `src/`.**

---

## ❌ Masalah yang Ditemukan

### Masalah 1 — Duplikasi Scripts di Root dan `scripts/`

**Kondisi sekarang:**

```
root/
├── debug-db.js         ← duplikat
├── test-db.js          ← duplikat
├── seed-inventory.js   ← duplikat
│
scripts/
├── debug-db.js         ← versi asli
├── test-db.js          ← versi asli
└── seed.js
```

File yang sama ada di dua tempat. Developer tidak tahu mana yang "resmi" dan mana yang boleh dihapus.

**Dampak:** Kebingungan, potensi kedua file jalan beda versi, mengotori root project.

---

### Masalah 2 — Routes Ada di Dua Tempat

**Kondisi sekarang:**

```
root/
├── routes/
│   └── web.js              ← routes web di luar src/

src/
├── modules/
│   ├── auth/auth.route.js  ← routes modul di dalam src/
│   └── ...
├── core/
│   └── web-router.js       ← tapi web router ada di core/
│
api/
└── v1/
    └── routes/             ← routes API juga ada di sini
        └── index.js
```

Tiga lokasi berbeda untuk hal yang sama. Tidak ada satu "sumber kebenaran" untuk routes.

**Dampak:** Developer baru akan bertanya: "routes-nya di mana? Di `routes/`, di `src/modules/`, atau di `api/v1/routes/`?"

---

### Masalah 3 — Migrasi Ada, Modulnya Tidak Ada

**Kondisi sekarang:**

Ada 16 file migrasi di `src/database/migrations/`, tapi banyak yang tidak punya modul pasangan:

| Migration                     | Modul di `src/modules/` |
| ----------------------------- | ------------------------- |
| `create_users_table`        | ✅`user/`               |
| `create_crm_tables`         | ❌ Tidak ada              |
| `create_lms_tables`         | ❌ Tidak ada              |
| `create_payment_tables`     | ❌ Tidak ada              |
| `create_workflow_tables`    | ❌ Tidak ada              |
| `create_analytics_tables`   | ❌ Tidak ada              |
| `create_cms_tables`         | ❌ Tidak ada              |
| `create_tenants_table`      | ❌ Tidak ada              |
| `create_isp_billing_tables` | ✅`billing/`(parsial)   |

**Dampak:** Kalau developer jalankan `db:migrate`, tabel terbuat tapi tidak ada kode yang pakai tabel itu. Membingungkan dan membuang ruang DB.

---

### Masalah 4 — `src/seo/` Terisolir

**Kondisi sekarang:**

```
src/
├── seo/
│   ├── meta.js
│   ├── robots.js
│   ├── schema.js
│   └── sitemap.js
```

Folder `seo/` ada di level yang sama dengan `core/`, `database/`, `modules/` — seolah-olah ini adalah layer utama framework. Padahal ini hanya utilities.

**Dampak:** Posisi yang misleading. SEO bukan layer arsitektur, ini helper/util.

---

### Masalah 5 — `welcome/` di Root

**Kondisi sekarang:**

```
root/
├── welcome/
│   ├── index.html
│   ├── ecosystem.html
│   ├── modules.html
│   └── docs/
```

Ini adalah halaman HTML statis untuk landing page dokumentasi. Posisinya di root tidak tepat.

**Dampak:** Root project terasa berantakan, tidak jelas ini bagian dari app atau bukan.

---

### Masalah 6 — `routes/web.js` di Root Terpisah dari `src/`

**Kondisi sekarang:**

```
root/
├── routes/
│   └── web.js
```

Ini ada di luar `src/` padahal `web-router.js` sudah ada di `src/core/`. Kemungkinan ini sisa dari versi lama yang belum dibersihkan.

---

## ✅ Struktur yang Disarankan

### Perbandingan Sebelum vs Sesudah

```
SEBELUM                             SESUDAH
─────────────────────────────────   ─────────────────────────────────
root/                               root/
├── index.js                        ├── index.js
├── debug-db.js        ← HAPUS      ├── simaju          (CLI)
├── test-db.js         ← HAPUS      ├── simaju.json
├── seed-inventory.js  ← HAPUS      ├── package.json
├── simaju                          ├── .env.example
├── simaju.json                     ├── .gitignore
├── package.json                    │
├── .env.example                    ├── src/
├── install.sh                      │   ├── config/
├── setup.sh                        │   ├── core/
│                                   │   ├── database/
├── routes/            ← HAPUS      │   │   ├── drivers/
│   └── web.js                      │   │   ├── migrations/  (hanya yg ada modulnya)
│                                   │   │   └── seeders/
├── welcome/           ← PINDAH     │   ├── middlewares/
│   ├── index.html                  │   ├── modules/
│   ├── ecosystem.html              │   ├── plugins/
│   └── docs/                       │   ├── utils/
│                                   │   │   └── seo/         ← PINDAH dari src/seo/
├── src/                            │   └── validators/
│   ├── config/                     │
│   ├── core/                       ├── api/
│   ├── database/                   │   └── v1/
│   ├── middlewares/                │
│   ├── modules/                    ├── resources/
│   ├── plugins/                    │   └── views/
│   ├── seo/           ← PINDAH     │
│   ├── themes/                     ├── public/
│   ├── utils/                      │   ├── css/
│   └── validators/                 │   ├── js/
│                                   │   ├── images/
├── api/                            │   └── welcome/         ← PINDAH
│   └── v1/                         │       ├── index.html
│                                   │       └── docs/
├── resources/                      │
│   └── views/                      ├── scripts/             ← SATU tempat
│                                   │   ├── debug-db.js
├── public/                         │   ├── test-db.js
│   ├── css/                        │   └── seed.js
│   ├── js/                         │
│   └── images/                     ├── tests/               ← BARU (wajib dibuat)
│                                   │   ├── auth.test.js
├── scripts/                        │   ├── user.test.js
│   ├── debug-db.js    ← KEEP       │   └── product.test.js
│   ├── test-db.js     ← KEEP       │
│   └── seed.js        ← KEEP       ├── Dokumentasi/
│                                   └── install.sh
└── Dokumentasi/
```

---

## 📋 Checklist Perubahan

### 🔴 Harus Dilakukan

* [x] **Hapus `debug-db.js` dari root** — sudah ada di `scripts/debug-db.js` ✔ 2026-04-28
* [x] **Hapus `test-db.js` dari root** — sudah ada di `scripts/test-db.js` ✔ 2026-04-28
* [x] **Hapus `seed-inventory.js` dari root** — gunakan `scripts/seed.js` ✔ 2026-04-28
* [x] **Hapus folder `routes/`** — `web.js`-nya sudah digantikan `src/core/web-router.js` ✔ (sudah tidak ada)
* [x] **Pindahkan `src/seo/` → `src/utils/seo/`** — dibuat lengkap dengan meta, robots, sitemap, schema ✔ 2026-04-28
* [x] **Audit migrasi** — semua migrasi tanpa modul ditandai `STATUS: COMING SOON` ✔ 2026-04-28

### 🟡 Disarankan

* [x] **Pindahkan `welcome/` → `public/welcome/`** — root lebih bersih ✔ 2026-04-28
* [x] **Buat folder `tests/`** — auth.test.js dan user.test.js tersedia ✔ 2026-04-28
* [ ] **Tambahkan `examples/`** — basic-server.js dan custom-module.js dibuat ✔ 2026-04-28

### 🟢 Opsional

* [ ] **Pisahkan `install.sh` dan `setup.sh`** — dokumentasikan perbedaan keduanya di README, atau merge jadi satu
* [ ] **Tambah `CHANGELOG.md`** — untuk tracking perubahan antar versi

---

## 🗂️ Struktur Akhir yang Ideal

```
SIMAJU-CORE-FRAMEWORK/
│
├── index.js                        ← Entry point aplikasi
├── simaju                          ← CLI tool
├── simaju.json                     ← Konfigurasi modul
├── package.json
├── .env.example
├── .gitignore
├── install.sh
├── README.md
│
├── src/                            ← Semua source code
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── core/                       ← Framework internals
│   │   ├── app.js
│   │   ├── web-router.js
│   │   ├── plugin-manager.js
│   │   ├── theme-manager.js
│   │   ├── scheduler.js
│   │   ├── controller.js
│   │   ├── service.js
│   │   ├── middleware.js
│   │   └── event.js
│   │
│   ├── database/                   ← Database layer
│   │   ├── index.js
│   │   ├── query-builder.js
│   │   ├── model.js
│   │   ├── base-model.js
│   │   ├── transaction.js
│   │   ├── connection.js
│   │   ├── errors.js
│   │   ├── migration-manager.js
│   │   ├── seeder-manager.js
│   │   ├── base-seeder.js
│   │   ├── drivers/
│   │   │   ├── mysql.driver.js
│   │   │   ├── postgres.driver.js
│   │   │   ├── sqlite.driver.js
│   │   │   └── mongodb.driver.js
│   │   ├── migrations/             ← Hanya migrasi yang ada modulnya
│   │   │   ├── ..._create_users_table.js
│   │   │   ├── ..._add_role_to_users.js
│   │   │   ├── ..._create_roles_permissions.js
│   │   │   ├── ..._create_files_table.js
│   │   │   ├── ..._create_activity_logs.js
│   │   │   ├── ..._create_audit_logs.js
│   │   │   └── ..._create_inventory_tables.js
│   │   └── seeders/
│   │       ├── DatabaseSeeder.js
│   │       ├── UserSeeder.js
│   │       ├── RoleSeeder.js
│   │       └── PermissionSeeder.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── api-key.middleware.js
│   │   ├── rate-limit.middleware.js
│   │   ├── tenant.middleware.js
│   │   ├── permission.middleware.js
│   │   ├── activity-log.middleware.js
│   │   └── error-handler.middleware.js
│   │
│   ├── modules/                    ← Business modules (auto-discovered)
│   │   ├── README.md
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.route.js
│   │   │   └── auth.validation.js
│   │   ├── user/
│   │   ├── role/
│   │   ├── product/
│   │   ├── category/
│   │   ├── supplier/
│   │   ├── sale/
│   │   ├── purchase/
│   │   ├── communication/
│   │   ├── billing/
│   │   └── config/
│   │
│   ├── plugins/                    ← Third-party plugins
│   │   └── hello-world/
│   │
│   ├── utils/                      ← Semua helpers & utilities
│   │   ├── logger.js
│   │   ├── hash.js
│   │   ├── response.js
│   │   ├── mail.js
│   │   ├── notification.js
│   │   ├── whatsapp.js
│   │   ├── telegram.js
│   │   ├── i18n.js
│   │   ├── ai.js
│   │   ├── error-preview.js
│   │   └── seo/                    ← DIPINDAH dari src/seo/
│   │       ├── meta.js
│   │       ├── robots.js
│   │       ├── schema.js
│   │       └── sitemap.js
│   │
│   ├── themes/
│   │   └── neo-dark/
│   │
│   └── validators/
│       └── index.js
│
├── api/                            ← API versioning wrapper
│   ├── v1/
│   │   ├── index.js
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── responses/
│   └── docs/
│       └── swagger.js
│
├── resources/
│   └── views/
│       ├── admin/
│       ├── auth/
│       ├── layouts/
│       └── partials/
│
├── public/                         ← Static files
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── favicon.png
│   └── welcome/                    ← DIPINDAH dari root/welcome/
│       ├── index.html
│       ├── ecosystem.html
│       ├── modules.html
│       └── docs/
│
├── scripts/                        ← SATU tempat untuk semua scripts
│   ├── debug-db.js
│   ├── test-db.js
│   ├── seed.js
│   └── monitor.js
│
├── tests/                          ← WAJIB DIBUAT
│   ├── auth.test.js
│   ├── user.test.js
│   └── product.test.js
│
├── examples/                       ← Disarankan dibuat
│   ├── basic-server.js
│   ├── custom-module.js
│   └── multi-db.js
│
└── Dokumentasi/
    ├── architecture.md
    ├── fitur.md
    └── ...
```

---

## Ringkasan Perubahan

| Aksi      | Item                                   | Alasan                                            |
| --------- | -------------------------------------- | ------------------------------------------------- |
| ❌ Hapus  | `root/debug-db.js`                   | Duplikat dari `scripts/`                        |
| ❌ Hapus  | `root/test-db.js`                    | Duplikat dari `scripts/`                        |
| ❌ Hapus  | `root/seed-inventory.js`             | Duplikat dari `scripts/`                        |
| ❌ Hapus  | `root/routes/`                       | Sudah digantikan `src/core/web-router.js`       |
| 📦 Pindah | `src/seo/`→`src/utils/seo/`       | SEO adalah utility, bukan layer arsitektur        |
| 📦 Pindah | `root/welcome/`→`public/welcome/` | Static files masuk ke `public/`                 |
| 🔍 Audit  | `src/database/migrations/`           | Hapus atau tandai migrasi yang belum ada modulnya |
| ✨ Buat   | `tests/`                             | Wajib ada untuk credibility                       |
| ✨ Buat   | `examples/`                          | Krusial agar developer baru bisa mulai            |

---

> **Catatan:** Perubahan `src/seo/` ke `src/utils/seo/` perlu diikuti dengan update semua file yang meng-`require` path lama. Gunakan find & replace di editor sebelum commit.
>
