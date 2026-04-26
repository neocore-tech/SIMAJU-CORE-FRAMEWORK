# Arsitektur Modul Simaju Core 📦

Folder ini berisi logika bisnis utama aplikasi yang bersifat statis (Internal Modules). Berbeda dengan Plugin yang bersifat dinamis, Modul adalah bagian inti dari aplikasi Anda.

## 📂 Struktur Standar Modul
Setiap modul yang dibuat melalui `./simaju make:module <name>` akan memiliki struktur sebagai berikut:

*   **`controller.js`**: Menangani request HTTP dan mengirimkan response.
*   **`service.js`**: Berisi logika bisnis utama, perhitungan, dan interaksi dengan database.
*   **`route.js`**: Mendefinisikan endpoint URL untuk modul tersebut.
*   **`validation.js`**: (Opsional) Berisi aturan validasi data untuk input user.

## 🛠️ Membuat Modul Baru
Gunakan perintah CLI Simaju untuk membuat scaffold modul secara instan:
```bash
./simaju make:module order
```

## 🔗 Pendaftaran Modul
Setelah dibuat, jangan lupa untuk mendaftarkan rute modul Anda di file `src/core/router.js` agar dapat diakses melalui web/API.

---
*Simaju Core: Structured for Scale.*
