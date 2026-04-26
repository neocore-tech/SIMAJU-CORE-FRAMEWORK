# Communication Gateway (Bab 7 & 26)

Simaju Core menyediakan sistem terpadu untuk menangani komunikasi multi-channel, mulai dari Email transaksional hingga notifikasi real-time.

## 📡 Konsep Utama

Communication Gateway bertindak sebagai lapisan abstraksi antara aplikasi dan penyedia layanan pihak ketiga (seperti Mailgun, Twilio, atau Firebase). Ini memungkinkan Anda untuk mengganti provider tanpa mengubah kode bisnis di modul lain.

---

## 🏗️ Arsitektur Gateway

Sistem ini dikelola melalui dua komponen utama:
1.  **`src/utils/mail.js`**: Fokus pada pengiriman email formal dan transaksional.
2.  **`src/utils/notification.js`**: Fokus pada notifikasi multi-channel dan real-time.

---

## 📲 Saluran Komunikasi (Channels)

### 1. Email (Bab 7)
Digunakan untuk reset password, invoice, dan laporan.
- **Provider**: SMTP, Mailgun, SendGrid.
- **Usage**:
  ```javascript
  const Mail = require('./utils/mail');
  await Mail.send('user@example.com', 'Invoice #123', 'Isi pesan...');
  ```

### 2. WhatsApp & SMS (Bab 26)
Digunakan untuk pengiriman kode OTP atau notifikasi cepat.
- **Provider**: Twilio, Wablas, atau API lokal.
- **Usage**:
  ```javascript
  const Notification = require('./utils/notification');
  await Notification.send(userId, 'Kode OTP Anda: 1234', 'urgent');
  ```

### 3. Push Notification
Untuk notifikasi aplikasi mobile atau web (PWA).
- **Provider**: Firebase Cloud Messaging (FCM).

### 4. Real-time App Notification
Notifikasi yang langsung muncul di dashboard user saat mereka sedang aktif.
- **Engine**: Menggunakan **Global Event Bus** yang terhubung ke Socket.io.

---

## ⚙️ Konfigurasi Provider

Semua kredensial provider disimpan secara aman di `.env` dan dikelola melalui modul **Config**:

```env
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=...
MAIL_PASS=...

WHATSAPP_API_KEY=...
FCM_SERVER_KEY=...
```

---

## 🔄 Alur Kerja Notifikasi (Standard Bab 11)

1.  **Trigger**: Sebuah aksi (misal: stok habis) memicu event.
2.  **Dispatcher**: `Notification.js` menangkap pesan.
3.  **Channel Selector**: Sistem memilih channel terbaik (Email jika user offline, Push jika online).
4.  **Logging**: Aktivitas pengiriman dicatat dalam `activity_logs`.
