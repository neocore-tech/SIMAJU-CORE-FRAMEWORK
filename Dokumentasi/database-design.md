# Database System

Simaju Core memiliki sistem database yang sangat fleksibel, mendukung berbagai driver dan transaksi aman.

## 🔌 Driver yang Didukung
- **PostgreSQL** (pg) - **[REKOMENDASI UTAMA]**
- **MySQL / MariaDB** (mysql2)
- **SQLite** (better-sqlite3)
- **MongoDB** (mongoose)

> [!TIP]
> Meskipun framework mendukung banyak database, **PostgreSQL** adalah pilihan yang sangat direkomendasikan untuk stabilitas dan fitur transaksi yang optimal di production.

## 🛠️ Penggunaan Query Builder

Sistem ini menggunakan API yang mirip dengan Laravel Query Builder:

```javascript
const DB = require('../database');

// Select
const users = await DB.table('users').where('active', 1).get();

// Join
const products = await DB.table('products')
  .join('categories', 'products.category_id', '=', 'categories.id')
  .get();

// Insert
const newId = await DB.table('users').insert({ name: 'Neo' });
```

## 🔒 Transaksi (Atomic Operations)

Sangat penting untuk transaksi keuangan atau stok:

```javascript
await DB.transaction(async (trx) => {
  await trx.table('sales').insert({...});
  await trx.table('products').where('id', 1).update({ stock: 5 });
});
```

## ⏱️ Monitoring
Setiap query yang berjalan lebih lama dari `SLOW_QUERY_MS` (diatur di `.env`) akan dicatat dalam log dengan level `WARN`.
