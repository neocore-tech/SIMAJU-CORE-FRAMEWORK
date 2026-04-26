# SIMAJU CORE FRAMEWORK
Next-Generation Modular Node.js Framework

```text
           _____                    _____                    _____                    _____                    _____                    _____                  
         /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \                 
        /::\    \                /::\    \                /::\____\                /::\    \                /::\    \                /::\____\                
       /::::\    \               \:::\    \              /::::|   |               /::::\    \               \:::\    \              /:::/    /                
      /::::::\    \               \:::\    \            /:::::|   |              /::::::\    \               \:::\    \            /:::/    /                 
     /:::/\:::\    \               \:::\    \          /::::::|   |             /:::/\:::\    \               \:::\    \          /:::/    /                  
    /:::/__\:::\    \               \:::\    \        /:::/|::|   |            /:::/__\:::\    \               \:::\    \        /:::/    /                   
    \:::\   \:::\    \              /::::\    \      /:::/ |::|   |           /::::\   \:::\    \              /::::\    \      /:::/    /                    
  ___\:::\   \:::\    \    ____    /::::::\    \    /:::/  |::|___|______    /::::::\   \:::\    \    _____   /::::::\    \    /:::/    /      _____          
 /\   \:::\   \:::\    \  /\   \  /:::/\:::\    \  /:::/   |::::::::\    \  /:::/\:::\   \:::\    \  /\    \ /:::/\:::\    \  /:::/____/      /\    \         
/::\   \:::\   \:::\____\/::\   \/:::/  \:::\____\/:::/    |:::::::::\____\/:::/  \:::\   \:::\____\/::\    /:::/  \:::\____\|:::|    /      /::\____\        
\:::\   \:::\   \::/    /\:::\  /:::/    \::/    /\::/    / ~~~~~/:::/    /\::/    \:::\  /:::/    /\:::\  /:::/    \::/    /|:::|____\     /:::/    /        
 \:::\   \:::\   \/____/  \:::\/:::/    / \/____/  \/____/      /:::/    /  \/____/ \:::\/:::/    /  \:::\/:::/    / \/____/  \:::\    \   /:::/    /         
  \:::\   \:::\    \       \::::::/    /                       /:::/    /            \::::::/    /    \::::::/    /            \:::\    \ /:::/    /          
   \:::\   \:::\____\       \::::/____/                       /:::/    /              \::::/    /      \::::/    /              \:::\    /:::/    /           
    \:::\  /:::/    /        \:::\    \                      /:::/    /               /:::/    /        \::/    /                \:::\__/:::/    /            
     \:::\/:::/    /          \:::\    \                    /:::/    /               /:::/    /          \/____/                  \::::::::/    /             
      \::::::/    /            \:::\    \                  /:::/    /               /:::/    /                                     \::::::/    /              
       \::::/    /              \:::\____\                /:::/    /               /:::/    /                                       \::::/    /               
        \::/    /                \::/    /                \::/    /                \::/    /                                         \::/____/                
         \/____/                  \/____/                  \/____/                  \/____/                                           ~~                      
```

**Simaju Core** adalah framework backend Node.js yang dirancang dengan arsitektur modular tinggi, memberikan kecepatan pengembangan startup namun tetap tangguh untuk skala enterprise.

---

## ✨ Fitur Utama

### 🧩 Arsitektur Modular
Bangun aplikasi Anda sebagai kumpulan modul yang independen. Setiap modul memiliki Controller, Service, Route, dan Model sendiri.

### 🏢 Enterprise CRM Module (Built-in)
Sistem manajemen pelanggan siap pakai:
- **Sales Pipeline**: Manajemen prospek dengan alur kerja Kanban.
- **Helpdesk Ticketing**: Sistem dukungan pelanggan otomatis.
- **Customer 360 View**: Riwayat lengkap aktivitas pelanggan.

### 🎓 LMS & E-Learning Module (Built-in)
Sistem manajemen pembelajaran terintegrasi:
- **Course Builder**: Kelola kursus, modul, dan materi secara hierarkis.
- **Progress Tracking**: Pelacakan otomatis kemajuan belajar siswa.
- **Assessment**: Sistem kuis dan evaluasi otomatis.

### 📱 Communication Gateway
Satu layanan untuk semua saluran:
- **WhatsApp Integration**: Kirim notifikasi via gateway WA.
- **Email Service**: Integrasi SMTP siap pakai.
- **Telegram Bot**: Hubungkan aplikasi Anda dengan Telegram.

### 🛠️ Simaju Ecosystem Tools
- **MJI Runner**: Alat baris perintah kustom untuk menjalankan server, migrasi, dan build.
- **Simaju CLI**: Generator kode untuk membuat modul dan migrasi secara instan.
- **Automatic Migration**: Mendukung SQLite, PostgreSQL, dan MySQL secara native.

---

## 🚀 Instalasi Cepat

Gunakan skrip instalasi otomatis untuk menyiapkan proyek dalam hitungan detik:

```bash
git clone https://github.com/username/simaju-core.git
cd simaju-core
chmod +x install.sh
./install.sh
```

Setelah instalasi selesai, jalankan server pengembangan:

```bash
./mji run dev
```

---

## 🗄️ Arsitektur Database

Simaju Core menggunakan lapisan abstraksi database yang kuat, memungkinkan Anda untuk berpindah antar engine database dengan konfigurasi minimal.

![Database Structure](src/public/images/readme/db-structure.png)

### Struktur Folder Database:
- **`src/database/migrations/`**: Menyimpan file histori perubahan skema database. Setiap file menggunakan timestamp untuk memastikan urutan eksekusi yang benar.
- **`src/database/drivers/`**: Berisi driver khusus untuk SQLite, PostgreSQL, dan MySQL. Sistem akan memilih driver secara otomatis berdasarkan konfigurasi `.env`.
- **`src/database/model.js`**: Base class untuk ORM Simaju. Memberikan fungsionalitas Active Record (all, find, create, update, delete) pada setiap model Anda.

---

## 🏗️ Struktur Direktori Lengkap

```text
├── src/
│   ├── config/          # Konfigurasi sistem (DB, Env, Auth)
│   ├── core/            # Inti framework (Kernel, Router, App)
│   ├── database/        # Migrasi, Driver, dan Model Base
│   ├── middlewares/     # Auth, Logging, RBAC, Rate Limiter
│   ├── modules/         # Modular Business Logic (Auth, CRM, LMS, dll)
│   ├── public/          # Aset statis (CSS, JS, Images)
│   ├── utils/           # Helper functions (Hash, JWT, Whatsapp)
│   └── views/           # Template HTML & Dokumentasi
├── mji                  # Custom Command Runner
├── simaju               # Core CLI Tool
└── index.js             # Main Entry Point
```

---

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js (Core)
- **Database**: Knex-like Query Builder (Custom Model)
- **Auth**: JWT (JSON Web Token) & bcrypt
- **Styles**: Vanilla CSS dengan desain modern premium
- **Documentation**: Built-in multi-page documentation system

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **Simaju Core Framework License** (Bilingual: ID/ENG). Anda diperbolehkan untuk menggunakan, memodifikasi, dan mendistribusikan perangkat lunak ini dengan syarat tetap menyertakan atribusi sumber utama.

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

**Dikembangkan oleh [Ilham Permana](https://github.com/ilhampermana)**
