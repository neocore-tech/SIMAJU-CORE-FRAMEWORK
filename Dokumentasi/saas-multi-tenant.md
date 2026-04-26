# Multi-Tenant System (SaaS Ready)

Simaju Core siap digunakan untuk membangun aplikasi SaaS (Software as a Service) di mana banyak perusahaan (Tenant) menggunakan satu aplikasi yang sama dengan isolasi data yang aman.

## 🏬 Konsep Tenant
Setiap user dapat diasosiasikan dengan satu atau lebih Tenant. Saat login, sistem akan mengidentifikasi tenant aktif user tersebut.

## 🔗 Tenant Middleware
Middleware `tenantIdentify` secara otomatis menyuntikkan data tenant ke dalam objek request:

```javascript
// Di dalam controller/service
const tenantId = req.tenant.id;
```

## 🔒 Isolasi Data
Pastikan setiap query database menyertakan filter `tenant_id` untuk menjaga keamanan data:

```javascript
await DB.table('products')
  .where('tenant_id', req.tenant.id)
  .get();
```

## 👥 Role dalam Tenant
User bisa memiliki role yang berbeda-beda di setiap tenant (misal: Admin di Toko A, tapi Staff di Toko B). Data ini dikelola dalam tabel `tenant_users`.
