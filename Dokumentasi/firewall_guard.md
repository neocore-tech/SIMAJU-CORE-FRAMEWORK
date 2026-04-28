# 🛡️ SIMAJU Guard (Rust Firewall)

**SIMAJU Guard** adalah Web Application Firewall (WAF) dan Reverse Proxy berkinerja sangat tinggi (*Ultra-High Performance*) yang dibangun sepenuhnya menggunakan bahasa pemrograman **Rust**.

SIMAJU Guard bertindak sebagai "Satpam" yang berdiri di garda paling depan (port 8080/8443) sebelum setiap *request* bisa mencapai inti aplikasi SIMAJU Core Node.js (port 3000).

---

## 🚀 Arsitektur Keamanan (Layered Defense)

Firewall ini menggunakan konsep pertahanan berlapis (*Defense-in-Depth*). Jika peretas lolos dari lapisan pertama, ia masih harus menghadapi lapisan berikutnya sebelum akhirnya diblokir.

Terdapat **5 Lapisan Pertahanan (Layered Defense)** di dalam Firewall ini:

### 1. Gate 1: Network Layer (`layers/network.rs`)
Lapisan terluar yang melakukan inspeksi IP Address penelepon.
- **IP Blacklist:** IP yang sudah terkenal buruk (atau dimasukkan secara manual) akan langsung ditolak mentah-mentah (`HTTP 403 Forbidden`).
- **IP Whitelist:** (Mode ketat) Hanya IP yang terdaftar yang boleh lewat.
- **Auto-Block:** Jika sebuah IP terdeteksi menyerang berkali-kali, ia akan otomatis masuk daftar Blacklist selama durasi yang ditentukan (misalnya 60 menit).

### 2. Gate 2: Request Inspector (`layers/inspector.rs`)
Lapisan yang mengecek pola pengiriman data (*Rate Limiting* & *Size Check*).
- **Token Bucket Rate Limiter:** Algoritma efisien untuk mencegah serangan *DDoS* dan *Spam*. Jika sebuah IP menembakkan ratusan request dalam sedetik, ia akan diblokir (`HTTP 429 Too Many Requests`). Limit ini bisa diatur secara global maupun per rute spesifik (misal: `/api/v1/auth` lebih ketat).
- **Body Size Limit:** Menolak muatan (*payload*) raksasa yang bisa membuat memori Node.js bocor atau *Crash* (OOM).

### 3. Gate 3: WAF Payload Analyzer (`layers/analyzer.rs`)
Lapisan cerdas (WAF) yang membongkar setiap URL dan Body Request untuk mencari jejak serangan (*Malicious Payload*).
- **Anti SQL Injection:** Memblokir pola `OR 1=1`, `UNION SELECT`, `DROP TABLE`, dan injeksi komentar `--`.
- **Anti XSS (Cross-Site Scripting):** Memblokir tag `<script>` nakal, `onerror=`, atau skema javascript berbahaya.
- **Anti Path Traversal:** Memblokir upaya membaca file rahasia server (misal: `../../../../etc/passwd`).
- **Anti Command Injection:** Memblokir injeksi perintah OS (misal: `; rm -rf /` atau `wget ...`).

### 4. Gate 4: Auth Protection (`layers/auth.rs`)
Penjaga khusus untuk melindungi gerbang Login dari serangan *Brute Force* (tebakan password membabi buta).
- Jika ada IP yang gagal login (respon 401 dari Node.js) sebanyak 5 kali berturut-turut, IP tersebut otomatis akan **dikunci (Lockout)** dari halaman login selama 15 menit. Request login mereka selanjutnya tidak akan diteruskan ke Node.js.

### 5. Gate 5: Admin API & Metrics (`admin/handlers.rs`)
Jalur khusus admin untuk memantau aktivitas secara diam-diam. Berjalan di port rahasia (default 9000).
- **Prometheus Metrics (`/metrics`):** Menyediakan metrik untuk Grafana (jumlah trafik, total request yang diblokir, dsb).
- **Manual Override API:** Anda bisa secara remote menambah IP ke daftar blokir (`POST /admin/block-ip`) atau melepas blokiran (`POST /admin/unblock-ip`) menggunakan Admin Key.

---

## 🛠️ Panduan Penggunaan CLI

Firewall Rust ini telah terintegrasi dengan mulus ke dalam perintah `mji`. Anda tidak perlu susah payah menyalakannya secara manual.

```bash
# REKOMENDASI: Menyalakan SIMAJU Core & Firewall Guard bersamaan
./mji up

# Menyalakan Framework Node.js saja (Jika sedang mendesain kode)
./mji dev

# Menyalakan Rust Firewall saja (untuk debugging)
./mji guard
```

---

## ⚙️ Konfigurasi (guard.toml)

Semua aturan keamanan Firewall dikendalikan secara dinamis melalui file `guard/guard.toml`. Anda bisa mengubah aturan ini tanpa harus melakukan *recompile* kode Rust.

Contoh snippet konfigurasi:
```toml
[server]
port      = 8080
admin_port = 9000
admin_key  = "KUNCI_RAHASIA_ANDA"

[rate_limit]
enabled             = true
requests_per_window = 100
window_seconds      = 60

[brute_force]
enabled          = true
max_failed       = 5
lockout_minutes  = 15
login_route      = "/api/v1/auth/login"

[payload]
detect_sqli               = true
detect_xss                = true
detect_traversal          = true
detect_command_injection  = true
```

---

## 🚀 Deployment (Production)

SIMAJU Guard di-desain ultra-ringan:
- **Binary Size:** < 15 MB
- **RAM Usage:** ~10 MB under load
- **Latency:** < 1ms overhead

Untuk lingkungan *Production*, silakan gunakan `guard/Dockerfile` untuk membangun *image* Alpine Linux yang super kecil, atau jalankan menggunakan daemon yang sudah disediakan: `guard/simaju-guard.service` (Systemd Linux).

*Kini aplikasi Anda aman layaknya benteng perusahaan elit!* 🛡️
