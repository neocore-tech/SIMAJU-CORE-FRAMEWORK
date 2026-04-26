# Keamanan & RBAC (Role Based Access Control)

Simaju Core mengamankan data Anda melalui beberapa lapis autentikasi dan otorisasi.

## 🔐 Autentikasi (JWT)
Menggunakan JWT (JSON Web Token) untuk menjaga session user.
- **Route**: `/api/auth/login` & `/api/auth/register`
- **Middleware**: `authMiddleware` (Mengecek validitas token Bearer).

## 🛡️ Otorisasi (RBAC)
Sistem ini menggunakan middleware `can` untuk mengecek hak akses spesifik user (Bab 12).

### Cara Penggunaan:
Dalam file route:
```javascript
const can = require('../../middlewares/permission.middleware');

router.post('/', auth, can('create-product'), ProductController.store);
```

## 🔑 API Key (Integrasi Eksternal)
Mendukung akses via header `x-api-key` untuk integrasi dengan sistem pihak ketiga.
- **Middleware**: `apiKeyAuth`.

## 📜 Activity Log
Setiap aksi perubahan data (POST, PUT, DELETE) dicatat secara otomatis mencakup:
- ID User
- Aktivitas (Method & URL)
- Payload (Body)
- IP Address
- Waktu
