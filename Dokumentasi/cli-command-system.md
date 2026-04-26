# CLI Command System (simaju)

Simaju Core dilengkapi dengan alat baris perintah (CLI) untuk mempercepat alur kerja pengembangan, mulai dari scaffolding modul hingga pengecekan sistem.

## 🛠️ Penggunaan Dasar

Jalankan perintah berikut di root direktori proyek:

```bash
node simaju <command> [options]
```

Atau jika sudah diberi izin eksekusi:

```bash
./simaju <command>
```

---

## 📜 Daftar Perintah

### 1. `make:module <name>`
Membuat struktur folder dan file boilerplate untuk modul baru di `src/modules/`.
- **Dibuat**: Controller, Service, Route, dan Validation.
- **Contoh**: `./simaju make:module order`

### 2. `db:ping`
Melakukan pengecekan koneksi ke database yang dikonfigurasi di `.env`.
- **Output**: Status health check dari driver database aktif.

### 3. `help`
Menampilkan daftar perintah yang tersedia.

---

## 🏗️ Mengembangkan Perintah Baru
Anda dapat menambahkan perintah baru dengan mengedit file `./simaju` di root proyek. Tambahkan logic baru ke dalam objek `commands` untuk memperluas kapabilitas CLI framework Anda.
