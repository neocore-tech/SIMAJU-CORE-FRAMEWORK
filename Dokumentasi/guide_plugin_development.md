# 🔌 Panduan Pengembangan Plugin

Dalam **SIMAJU Core Framework**, sebuah **Plugin** adalah fitur berukuran kecil atau integrasi pihak ketiga yang menyuntikkan *behavior* tambahan tanpa mengubah kode inti (*Core*) maupun modul (*Modules*) yang sudah ada.

Plugin bekerja secara reaktif dengan cara mendengarkan (mendeklarasikan) _Events_ melalui sistem **Event Bus**.

---

## 1. Konsep Dasar Plugin

Plugin dalam SIMAJU Core dirancang sangat mirip dengan arsitektur plugin milik WordPress, di mana plugin merespons "Hook" atau "Event".

Contoh penggunaan Plugin:
*   Plugin **Email Notifier**: Otomatis mengirim email ucapan selamat ketika ada *event* `user.registered`.
*   Plugin **SEO Auto-Ping**: Mengabari Google Indexer saat ada *event* `article.published`.
*   Plugin **Stripe Payment**: Menambahkan metode pembayaran pihak ketiga tanpa mengotori `payment-system` core.

---

## 2. Struktur Direktori Plugin

Setiap plugin harus diletakkan di dalam folder `src/plugins/<nama_plugin>`.

```text
src/plugins/email-notifier/
├── index.js                  # Entry point (wajib)
├── config.json               # Konfigurasi bawaan plugin (opsional)
└── services/                 # Folder logika pendukung (opsional)
```

---

## 3. Cara Membuat Plugin

### Langkah 1: Registrasi Metadata
Sebuah plugin harus mengekspor objek yang mendefinisikan siapa dirinya dan fungsi `init` yang akan dieksekusi oleh *Core Engine* saat booting.

```javascript
// src/plugins/email-notifier/index.js

module.exports = {
  // Metadata Plugin
  name: 'Email Notifier',
  version: '1.0.0',
  description: 'Mengirim email selamat datang untuk user baru',
  
  // Fungsi Inisialisasi yang dipanggil oleh Core saat Boot
  init: (app, eventBus) => {
    console.log('[Plugin] Email Notifier diinisialisasi.');

    // Mendaftarkan Event Listener (Hooking)
    eventBus.on('user.registered', async (userData) => {
        try {
            await sendWelcomeEmail(userData.email, userData.name);
            console.log(`[Plugin] Email sukses terkirim ke ${userData.email}`);
        } catch (error) {
            console.error('[Plugin] Gagal mengirim email:', error);
        }
    });
  }
};

async function sendWelcomeEmail(email, name) {
    // Logika kirim email via SMTP/Nodemailer
}
```

### Langkah 2: Mengaktifkan Plugin
Agar plugin Anda dijalankan oleh sistem, Anda harus memasukkannya ke dalam daftar `plugins` di dalam file `simaju.json` yang terletak di *root project*.

```json
{
  "name": "simaju-app",
  "version": "1.0.0",
  "plugins": [
    "email-notifier"
  ]
}
```

---

## 4. Keuntungan Menggunakan Plugin

1. **Terisolasi (Sandboxed):** Plugin yang *error* biasanya tidak akan membuat seluruh framework hancur, ia hanya akan terisolasi di dalam *event listener*-nya sendiri.
2. **Mudah Dicopot (Pluggable):** Jika suatu saat perusahaan tidak membutuhkan integrasi "Email Notifier" lagi, cukup hapus namanya dari `simaju.json`. Anda tidak perlu mengubah 1 baris kode pun di dalam `auth.controller.js`!
3. **Reusable:** Plugin bisa didistribusikan dalam format `.zip` atau NPM dan digunakan ulang oleh perusahaan klien lain yang juga menggunakan SIMAJU Core.
