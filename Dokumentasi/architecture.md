# Arsitektur Framework Simaju Core

Simaju Core menggunakan arsitektur **Modular Layered Architecture** yang terinspirasi dari Laravel namun dioptimalkan untuk performa Node.js.

## 🏗️ Struktur Folder Utama

```text
/src
  /core              # Engine utama (App, Router, Scheduler, Event Bus)
  /database          # Database Manager & Drivers (MySQL, PG, SQLite, Mongo)
  /modules           # Fitur modular (Auth, User, Product, dll)
  /middlewares       # Filter request (Auth, Permission, Tenant, Log)
  /utils             # Utility mandiri (Logger, Response, Mail, AI)
  /config            # Pengaturan global & validator env
```

## 🔄 Alur Fitur (Sesuai Bab 11 & 31)

Setiap fitur dalam `/src/modules` wajib mengikuti alur:

1.  **Route**: Mendefinisikan endpoint.
2.  **Validation**: Memastikan input sesuai spesifikasi sebelum masuk ke logic.
3.  **Controller**: Menangani request/response HTTP.
4.  **Service**: Tempat di mana logic bisnis berada.
5.  **Output**: Response seragam melalui `src/utils/response.js`.

## 📦 Global Components

- **Event Bus**: Sistem sinkronisasi antar modul tanpa coupling ketat.
- **Scheduler**: Pengelolaan tugas latar belakang otomatis.
- **Activity Log**: Pencatatan otomatis setiap perubahan data.
