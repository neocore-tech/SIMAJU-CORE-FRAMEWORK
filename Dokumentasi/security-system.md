# Security System (Bab 6 & 27)

Simaju Core mengutamakan keamanan data melalui berbagai lapisan proteksi.

## 🛡️ Lapisan Keamanan

1.  **Rate Limiting**: Membatasi jumlah request per IP untuk mencegah serangan DDoS dan Brute Force.
2.  **JWT Security**: Token yang dienkripsi dengan secret key yang kuat.
3.  **API Key Auth**: Untuk akses terpercaya dari aplikasi pihak ketiga.
4.  **Helmet JS**: Mengamankan HTTP headers dari serangan umum seperti XSS dan Clickjacking.

## 🔑 OTP (Bab 6)
Sistem ini menyediakan kerangka kerja untuk pengiriman OTP melalui modul komunikasi (Email/SMS) untuk verifikasi dua langkah (2FA).

## 📍 Device Tracking (Bab 27)
Log aktivitas mencatat IP address dan device info user untuk mendeteksi login mencurigakan.
