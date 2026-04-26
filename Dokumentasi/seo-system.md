# SEO System (Bab 9)

Simaju Core mengintegrasikan fitur SEO (Search Engine Optimization) secara mendalam ke dalam core framework untuk memastikan aplikasi Anda ramah terhadap mesin pencari (Google, Bing, dll).

## 🚀 Fitur Utama

### 1. Meta Data Generator
Sistem secara otomatis menghasilkan tag meta yang diperlukan untuk SEO dan Social Sharing (Open Graph).
- **Utility**: `src/seo/meta.js`
- **Output**: Title, Description, Keywords, OG Title, OG Description.

### 2. Smart URL / Slug (Bab 9.2)
Setiap konten (seperti Produk atau Artikel CMS) secara otomatis menghasilkan URL yang "bersih" dan mudah dibaca.
- **Logic**: Mengonversi judul menjadi lowercase, mengganti spasi dengan dash, dan menghapus karakter khusus.
- **Contoh**: `Produk Sepatu Lari!` -> `produk-sepatu-lari`

### 3. Sitemap Generator (Bab 9.3)
Framework menyediakan utilitas untuk menghasilkan file `sitemap.xml` secara dinamis yang berisi daftar seluruh halaman publik Anda.

### 4. Schema.org (JSON-LD)
Mendukung injeksi structured data ke dalam halaman untuk hasil pencarian yang lebih kaya (Rich Snippets).

---

## 🛠️ Penggunaan dalam Code

### Injeksi Meta di Controller/Service:
```javascript
const SEOMeta = require('../../seo/meta');

const seoData = SEOMeta.generate(
  'Sepatu Lari Pro', 
  'Beli sepatu lari terbaik dengan harga terjangkau...',
  ['sepatu', 'lari', 'olahraga']
);
```

### Integrasi dengan CMS (Bab 30):
Saat menyimpan artikel baru, sistem CMS secara otomatis memanggil fungsi slugifier:
```javascript
const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
```

---

## 🗺️ Rencana Pengembangan Sitemap
Sistem sitemap akan mengumpulkan data dari:
- Modul **CMS** (Daftar Artikel).
- Modul **Product** (Daftar Produk Publik).
- Modul **Page** (Halaman Statis).

File `sitemap.xml` akan diperbarui secara otomatis melalui **Scheduler** (Bab 16) setiap 24 jam.
