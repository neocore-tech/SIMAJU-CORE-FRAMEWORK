# Feature & Command System (Bab 10 & 16)

Sistem ini memungkinkan framework untuk berjalan secara otomatis dan modular.

## 📡 Global Event Bus (Bab 10)
Memungkinkan komunikasi antar modul tanpa ketergantungan langsung.
- **Trigger**: `EventBus.emit('event:name', data)`
- **Listener**: `EventBus.on('event:name', callback)`

Sangat berguna untuk sistem plugin atau hook (misal: kirim email otomatis setelah register).

## ⏰ Background Scheduler (Bab 16)
Menggunakan `node-cron` untuk menjalankan perintah otomatis pada waktu tertentu.
- **Daily Tasks**: Cek stok, backup database.
- **Hourly Tasks**: Pembersihan cache, rotasi log.

Semua scheduler dikelola secara terpusat di `src/core/scheduler.js`.
