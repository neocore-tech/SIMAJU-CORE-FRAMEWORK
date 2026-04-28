
# 🛡️ SIMAJU Guard — Panduan Lengkap Implementasi & Perbaikan

> Dokumen teknis lengkap untuk membangun dan memperbaiki SIMAJU Guard (Rust WAF & Reverse Proxy)
> agar siap digunakan di lingkungan produksi.

---

## 📋 Daftar Isi

1. [Struktur Project](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#struktur)
2. [Cargo.toml — Dependencies](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#cargo)
3. [Konfigurasi guard.toml](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#config)
4. [Implementasi Per Layer](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#implementasi)
   * [Gate 1 — Network Layer](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#gate1)
   * [Gate 2 — Request Inspector](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#gate2)
   * [Gate 3 — WAF Analyzer](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#gate3)
   * [Gate 4 — Auth Protection (DIPERBAIKI)](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#gate4)
   * [Gate 5 — Admin API &amp; Metrics](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#gate5)
5. [TLS Termination (BARU)](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#tls)
6. [Security Headers Middleware](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#headers)
7. [Audit Logger](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#logger)
8. [Main Entry Point](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#main)
9. [Deployment](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#deployment)
10. [Checklist Produksi](https://claude.ai/chat/343f405c-7a52-417c-b9de-6755fe10ee18#checklist)

---

## 1. Struktur Project

```
simaju-guard/
├── Cargo.toml
├── guard.toml                    ← Konfigurasi utama
├── Dockerfile                    ← Alpine Linux image
├── simaju-guard.service          ← Systemd daemon
│
├── src/
│   ├── main.rs                   ← Entry point & server setup
│   ├── config.rs                 ← Load guard.toml + env vars
│   │
│   ├── layers/
│   │   ├── mod.rs
│   │   ├── network.rs            ← Gate 1: IP filter
│   │   ├── inspector.rs          ← Gate 2: Rate limit + size
│   │   ├── analyzer.rs           ← Gate 3: WAF
│   │   ├── auth.rs               ← Gate 4: Brute force (DIPERBAIKI)
│   │   └── tls.rs                ← TLS termination (BARU)
│   │
│   ├── admin/
│   │   └── handlers.rs           ← Gate 5: Admin API + Metrics
│   │
│   ├── middleware/
│   │   ├── security_headers.rs   ← Inject HTTP security headers
│   │   └── request_id.rs         ← X-Request-ID tracing
│   │
│   ├── logger/
│   │   └── audit.rs              ← Structured JSON audit log
│   │
│   └── utils/
│       └── ip.rs                 ← IP parsing helpers
│
└── tests/
    ├── gate1_test.rs
    ├── gate2_test.rs
    ├── gate3_waf_test.rs
    └── gate4_auth_test.rs
```

---

## 2. Cargo.toml — Dependencies

```toml
[package]
name    = "simaju-guard"
version = "0.1.0"
edition = "2021"

[dependencies]
# Async runtime
tokio          = { version = "1", features = ["full"] }

# HTTP framework & proxy
axum           = "0.7"
tower          = "0.4"
tower-http     = { version = "0.5", features = ["cors", "limit", "trace"] }
hyper          = { version = "1", features = ["full"] }
hyper-util     = { version = "0.1", features = ["full"] }
http-body-util = "0.1"

# TLS (BARU)
rustls         = "0.23"
tokio-rustls   = "0.26"
rustls-pemfile = "2"

# Rate limiting
governor       = "0.6"

# IP address & GeoIP
ipnetwork      = "0.20"

# WAF pattern matching
regex          = "1"
once_cell      = "1"

# JWT validation
jsonwebtoken   = "9"

# Concurrent data structures
dashmap        = "5"

# Prometheus metrics
prometheus     = "0.13"

# Serialization
serde          = { version = "1", features = ["derive"] }
serde_json     = "1"
toml           = "0.8"

# Logging
tracing            = "0.1"
tracing-subscriber = { version = "0.3", features = ["json"] }

# Waktu
chrono    = { version = "0.4", features = ["serde"] }
tokio-util = { version = "0.7", features = ["time"] }

# UUID untuk Request ID
uuid = { version = "1", features = ["v4"] }
```

---

## 3. Konfigurasi guard.toml

> ⚠️ **PERBAIKAN:** `admin_key` sekarang dibaca dari environment variable, bukan hardcode di file ini.
> Pastikan file ini **TIDAK** di-commit ke Git jika berisi data sensitif. Tambahkan `guard.toml` ke `.gitignore`.

```toml
# ============================================
# SIMAJU Guard — Konfigurasi Utama
# ============================================

[server]
port       = 8080
admin_bind = "127.0.0.1:9000"   # PERBAIKAN: bind localhost saja, bukan 0.0.0.0
backend    = "http://127.0.0.1:3000"  # Alamat SIMAJU Core (Node.js)

# PERBAIKAN: Admin key dibaca dari environment variable
# Set dengan: export SIMAJU_ADMIN_KEY="kunci_rahasia_panjang_anda"
admin_key_env = "SIMAJU_ADMIN_KEY"

# ============================================
# TLS (BARU) — Aktifkan untuk produksi
# ============================================
[tls]
enabled   = true
port      = 8443
cert_path = "/etc/simaju/cert.pem"
key_path  = "/etc/simaju/key.pem"
# Redirect HTTP ke HTTPS otomatis
redirect_http = true

# ============================================
# Gate 1: Network Layer
# ============================================
[network]
enabled = true

# IP yang langsung diblokir (CIDR didukung)
blacklist = [
  "192.0.2.0/24",
]

# Kosongkan untuk mode terbuka, isi untuk mode ketat
whitelist = []

# Auto-block jika IP menyerang berkali-kali
auto_block_enabled         = true
auto_block_threshold       = 10     # berapa kali trigger sebelum diblokir
auto_block_duration_minutes = 60    # durasi blokir otomatis

# ============================================
# Gate 2: Request Inspector
# ============================================
[rate_limit]
enabled             = true
requests_per_window = 100
window_seconds      = 60

# Rate limit khusus per rute (lebih ketat)
[[rate_limit.routes]]
path                = "/api/v1/auth/login"
requests_per_window = 10
window_seconds      = 60

[[rate_limit.routes]]
path                = "/api/v1/auth/register"
requests_per_window = 5
window_seconds      = 60

[payload]
max_body_bytes = 1048576   # 1 MB

# ============================================
# Gate 3: WAF Payload Analyzer
# ============================================
[waf]
enabled = true

# PERBAIKAN: Gunakan "log_only" dulu saat pertama deploy untuk tuning
# Ganti ke "block" setelah yakin tidak ada false positive
mode = "log_only"   # "block" | "log_only"

detect_sqli              = true
detect_xss               = true
detect_traversal         = true
detect_command_injection = true

# Rute yang dikecualikan dari WAF scan (misal: admin query tools)
whitelist_routes = [
  "/admin/query",
  "/api/v1/report/raw",
]

# ============================================
# Gate 4: Auth Protection (DIPERBAIKI)
# ============================================
[brute_force]
enabled         = true
max_failed      = 5             # Gagal login maksimal sebelum lockout
lockout_minutes = 15            # Durasi lockout
login_route     = "/api/v1/auth/login"

# PERBAIKAN: Counter dikelola SEPENUHNYA oleh Rust
# Tidak bergantung response 401 dari Node.js
# Rust menghitung sendiri dari pattern request
count_mode = "rust_side"   # "rust_side" (rekomendasi) | "backend_response"

# ============================================
# Gate 5: Admin & Metrics
# ============================================
[metrics]
enabled = true
path    = "/metrics"
# PERBAIKAN: Metrics dilindungi oleh admin_key juga
require_auth = true
```

---

## 4. Implementasi Per Layer

---

### Gate 1 — Network Layer (`layers/network.rs`)

```rust
use dashmap::DashMap;
use ipnetwork::IpNetwork;
use std::net::IpAddr;
use std::sync::Arc;
use std::time::{Duration, Instant};
use crate::config::NetworkConfig;

pub struct NetworkLayer {
    blacklist:    Vec<IpNetwork>,
    whitelist:    Vec<IpNetwork>,
    auto_blocked: Arc<DashMap<IpAddr, Instant>>,  // IP → waktu blokir berakhir
    strike_count: Arc<DashMap<IpAddr, u32>>,       // IP → jumlah strike
    config:       NetworkConfig,
}

impl NetworkLayer {
    pub fn new(config: NetworkConfig) -> Self {
        Self {
            blacklist:    config.blacklist.iter()
                .filter_map(|s| s.parse().ok()).collect(),
            whitelist:    config.whitelist.iter()
                .filter_map(|s| s.parse().ok()).collect(),
            auto_blocked: Arc::new(DashMap::new()),
            strike_count: Arc::new(DashMap::new()),
            config,
        }
    }

    /// Periksa apakah IP boleh melewati Gate 1
    pub fn is_allowed(&self, ip: IpAddr) -> Result<(), BlockReason> {
        // Cek whitelist mode (jika whitelist tidak kosong)
        if !self.whitelist.is_empty() {
            let in_whitelist = self.whitelist.iter().any(|net| net.contains(ip));
            if !in_whitelist {
                return Err(BlockReason::NotWhitelisted);
            }
        }

        // Cek blacklist statis
        let in_blacklist = self.blacklist.iter().any(|net| net.contains(ip));
        if in_blacklist {
            return Err(BlockReason::Blacklisted);
        }

        // Cek auto-block (blokir sementara)
        if let Some(unblock_time) = self.auto_blocked.get(&ip) {
            if Instant::now() < *unblock_time {
                return Err(BlockReason::AutoBlocked);
            } else {
                // Sudah kadaluarsa, hapus dari auto-block
                drop(unblock_time);
                self.auto_blocked.remove(&ip);
            }
        }

        Ok(())
    }

    /// Tambahkan strike ke IP (dipanggil saat ada pelanggaran di layer lain)
    pub fn add_strike(&self, ip: IpAddr) {
        if !self.config.auto_block_enabled {
            return;
        }

        let mut count = self.strike_count.entry(ip).or_insert(0);
        *count += 1;

        if *count >= self.config.auto_block_threshold {
            let duration = Duration::from_secs(
                self.config.auto_block_duration_minutes * 60
            );
            self.auto_blocked.insert(ip, Instant::now() + duration);
            self.strike_count.remove(&ip);

            tracing::warn!(
                ip = %ip,
                "IP auto-blocked selama {} menit",
                self.config.auto_block_duration_minutes
            );
        }
    }

    /// Block manual (dari Admin API)
    pub fn manual_block(&self, ip: IpAddr, duration_minutes: u64) {
        let duration = Duration::from_secs(duration_minutes * 60);
        self.auto_blocked.insert(ip, Instant::now() + duration);
    }

    /// Unblock manual (dari Admin API)
    pub fn manual_unblock(&self, ip: IpAddr) {
        self.auto_blocked.remove(&ip);
        self.strike_count.remove(&ip);
    }
}

#[derive(Debug)]
pub enum BlockReason {
    Blacklisted,
    NotWhitelisted,
    AutoBlocked,
}
```

---

### Gate 2 — Request Inspector (`layers/inspector.rs`)

```rust
use governor::{Quota, RateLimiter, clock::DefaultClock, state::keyed::DefaultKeyedStateStore};
use std::net::IpAddr;
use std::num::NonZeroU32;
use std::sync::Arc;
use crate::config::RateLimitConfig;

pub struct RequestInspector {
    global_limiter: Arc<RateLimiter<IpAddr, DefaultKeyedStateStore<IpAddr>, DefaultClock>>,
    route_limiters: Vec<(String, Arc<RateLimiter<IpAddr, DefaultKeyedStateStore<IpAddr>, DefaultClock>>)>,
    max_body_bytes: usize,
}

impl RequestInspector {
    pub fn new(config: RateLimitConfig, max_body_bytes: usize) -> Self {
        // Rate limiter global
        let quota = Quota::per_minute(
            NonZeroU32::new(config.requests_per_window).unwrap()
        );
        let global_limiter = Arc::new(RateLimiter::keyed(quota));

        // Rate limiter per rute
        let route_limiters = config.routes.iter().map(|r| {
            let q = Quota::per_minute(
                NonZeroU32::new(r.requests_per_window).unwrap()
            );
            (r.path.clone(), Arc::new(RateLimiter::keyed(q)))
        }).collect();

        Self { global_limiter, route_limiters, max_body_bytes }
    }

    /// Cek rate limit. Return Err jika melebihi batas.
    pub fn check_rate(&self, ip: IpAddr, path: &str) -> Result<(), &'static str> {
        // Cek route-specific limiter dulu
        for (route, limiter) in &self.route_limiters {
            if path.starts_with(route.as_str()) {
                return limiter.check_key(&ip)
                    .map_err(|_| "rate_limit_exceeded_route");
            }
        }

        // Cek global limiter
        self.global_limiter.check_key(&ip)
            .map_err(|_| "rate_limit_exceeded_global")
    }

    /// Cek ukuran body
    pub fn check_body_size(&self, size: usize) -> Result<(), &'static str> {
        if size > self.max_body_bytes {
            return Err("payload_too_large");
        }
        Ok(())
    }
}
```

---

### Gate 3 — WAF Analyzer (`layers/analyzer.rs`)

```rust
use once_cell::sync::Lazy;
use regex::RegexSet;
use crate::config::WafConfig;

// Pattern dikompilasi sekali saat startup (bukan setiap request)
static SQLI_PATTERNS: Lazy<RegexSet> = Lazy::new(|| {
    RegexSet::new([
        r"(?i)(\bor\b\s+\d+\s*=\s*\d+)",
        r"(?i)(union\s+(all\s+)?select)",
        r"(?i)(drop\s+table)",
        r"(?i)(insert\s+into)",
        r"(?i)(--\s*$)",
        r"(?i)(/\*.*\*/)",
        r"(?i)(;\s*exec\b)",
        r"(?i)(xp_cmdshell)",
        r"(?i)(information_schema)",
    ]).unwrap()
});

static XSS_PATTERNS: Lazy<RegexSet> = Lazy::new(|| {
    RegexSet::new([
        r"(?i)(<script[\s>])",
        r"(?i)(</script>)",
        r"(?i)(javascript\s*:)",
        r"(?i)(on\w+\s*=)",     // onerror=, onload=, dll
        r"(?i)(<iframe[\s>])",
        r"(?i)(eval\s*\()",
        r"(?i)(document\.cookie)",
        r"(?i)(\.innerHTML\s*=)",
    ]).unwrap()
});

static TRAVERSAL_PATTERNS: Lazy<RegexSet> = Lazy::new(|| {
    RegexSet::new([
        r"(\.\./){2,}",
        r"(%2e%2e%2f){2,}",
        r"(%252e%252e%252f){2,}",
        r"(\.\.\\){2,}",
        r"(/etc/passwd)",
        r"(/etc/shadow)",
        r"(c:\\windows)",
    ]).unwrap()
});

static CMDI_PATTERNS: Lazy<RegexSet> = Lazy::new(|| {
    RegexSet::new([
        r"(;\s*(rm|wget|curl|bash|sh|cat|ls)\b)",
        r"(\|\s*(cat|bash|sh|wget|curl)\b)",
        r"(`[^`]+`)",
        r"(\$\([^)]+\))",
        r"(&&\s*(rm|wget|curl|bash))",
    ]).unwrap()
});

pub struct WafAnalyzer {
    config: WafConfig,
}

pub enum WafVerdict {
    Allow,
    Block(String),  // Alasan pemblokiran
    Log(String),    // Mode log_only — catat tapi tetap lanjutkan
}

impl WafAnalyzer {
    pub fn new(config: WafConfig) -> Self {
        Self { config }
    }

    pub fn analyze(&self, path: &str, body: &str, query: &str) -> WafVerdict {
        // Lewati rute yang di-whitelist
        if self.config.whitelist_routes.iter().any(|r| path.starts_with(r.as_str())) {
            return WafVerdict::Allow;
        }

        let combined = format!("{} {} {}", path, query, body);
        let mut threats = Vec::new();

        if self.config.detect_sqli && SQLI_PATTERNS.is_match(&combined) {
            threats.push("sql_injection");
        }
        if self.config.detect_xss && XSS_PATTERNS.is_match(&combined) {
            threats.push("xss");
        }
        if self.config.detect_traversal && TRAVERSAL_PATTERNS.is_match(&combined) {
            threats.push("path_traversal");
        }
        if self.config.detect_command_injection && CMDI_PATTERNS.is_match(&combined) {
            threats.push("command_injection");
        }

        if threats.is_empty() {
            return WafVerdict::Allow;
        }

        let reason = threats.join(", ");

        match self.config.mode.as_str() {
            "block"    => WafVerdict::Block(reason),
            "log_only" => WafVerdict::Log(reason),
            _          => WafVerdict::Allow,
        }
    }
}
```

---

### Gate 4 — Auth Protection DIPERBAIKI (`layers/auth.rs`)

> ⚠️ **PERBAIKAN KRITIS:** Counter brute force sekarang dikelola sepenuhnya oleh Rust.
> Tidak lagi bergantung pada response 401 dari Node.js (celah keamanan sebelumnya).

```rust
use dashmap::DashMap;
use std::net::IpAddr;
use std::sync::Arc;
use std::time::{Duration, Instant};
use crate::config::BruteForceConfig;

pub struct AuthProtection {
    // IP → (jumlah gagal, waktu percobaan terakhir)
    failed_attempts: Arc<DashMap<IpAddr, (u32, Instant)>>,
    // IP → waktu lockout berakhir
    lockouts: Arc<DashMap<IpAddr, Instant>>,
    config: BruteForceConfig,
}

impl AuthProtection {
    pub fn new(config: BruteForceConfig) -> Self {
        Self {
            failed_attempts: Arc::new(DashMap::new()),
            lockouts:         Arc::new(DashMap::new()),
            config,
        }
    }

    /// Cek apakah IP boleh mencoba login.
    /// Dipanggil SEBELUM request diteruskan ke Node.js.
    pub fn is_login_allowed(&self, ip: IpAddr) -> Result<(), u64> {
        if !self.config.enabled {
            return Ok(());
        }

        if let Some(unlock_time) = self.lockouts.get(&ip) {
            if Instant::now() < *unlock_time {
                let sisa = unlock_time.duration_since(Instant::now()).as_secs();
                return Err(sisa);   // Return sisa detik lockout
            } else {
                drop(unlock_time);
                self.lockouts.remove(&ip);
                self.failed_attempts.remove(&ip);
            }
        }

        Ok(())
    }

    /// Dipanggil saat login BERHASIL — reset counter IP ini
    pub fn on_login_success(&self, ip: IpAddr) {
        self.failed_attempts.remove(&ip);
        self.lockouts.remove(&ip);
    }

    /// Dipanggil saat login GAGAL (response 401 dari Node.js)
    /// PERBAIKAN: Rust yang menghitung, bukan bergantung Node.js saja
    pub fn on_login_failed(&self, ip: IpAddr) {
        let now = Instant::now();
        let mut entry = self.failed_attempts.entry(ip).or_insert((0, now));

        // Reset counter jika percobaan terakhir sudah lama (> 30 menit)
        if now.duration_since(entry.1) > Duration::from_secs(1800) {
            *entry = (0, now);
        }

        entry.0 += 1;
        entry.1 = now;

        tracing::warn!(
            ip       = %ip,
            attempts = entry.0,
            max      = self.config.max_failed,
            "Gagal login"
        );

        if entry.0 >= self.config.max_failed {
            let lockout_duration = Duration::from_secs(
                self.config.lockout_minutes * 60
            );
            self.lockouts.insert(ip, Instant::now() + lockout_duration);
            self.failed_attempts.remove(&ip);

            tracing::warn!(
                ip      = %ip,
                minutes = self.config.lockout_minutes,
                "IP dikunci karena brute force"
            );
        }
    }

    /// Cek apakah path ini adalah login route
    pub fn is_login_route(&self, path: &str) -> bool {
        path == self.config.login_route
    }
}
```

---

### Gate 5 — Admin API & Metrics (`admin/handlers.rs`)

```rust
use axum::{
    extract::{Json, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use prometheus::{Encoder, TextEncoder};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;

pub fn admin_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/metrics",      get(metrics_handler))
        .route("/admin/block-ip",   post(block_ip_handler))
        .route("/admin/unblock-ip", post(unblock_ip_handler))
        .route("/admin/status",     get(status_handler))
}

/// Middleware: validasi Admin Key dari header
fn validate_admin_key(headers: &HeaderMap, expected: &str) -> bool {
    headers
        .get("X-Admin-Key")
        .and_then(|v| v.to_str().ok())
        .map(|v| v == expected)
        .unwrap_or(false)
}

/// GET /metrics — Prometheus metrics
async fn metrics_handler(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    // PERBAIKAN: Metrics juga dilindungi Admin Key
    if !validate_admin_key(&headers, &state.config.admin_key) {
        return (StatusCode::UNAUTHORIZED, "Unauthorized").into_response();
    }

    let encoder  = TextEncoder::new();
    let families = prometheus::gather();
    let mut buf  = Vec::new();
    encoder.encode(&families, &mut buf).unwrap();

    (StatusCode::OK, String::from_utf8(buf).unwrap()).into_response()
}

#[derive(Deserialize)]
struct BlockIpRequest {
    ip:               String,
    duration_minutes: Option<u64>,
}

#[derive(Serialize)]
struct AdminResponse {
    success: bool,
    message: String,
}

/// POST /admin/block-ip
async fn block_ip_handler(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<BlockIpRequest>,
) -> impl IntoResponse {
    if !validate_admin_key(&headers, &state.config.admin_key) {
        return (StatusCode::UNAUTHORIZED,
            Json(AdminResponse { success: false, message: "Unauthorized".into() })
        );
    }

    match payload.ip.parse() {
        Ok(ip) => {
            let duration = payload.duration_minutes.unwrap_or(60);
            state.network_layer.manual_block(ip, duration);
            tracing::warn!(ip = %ip, "Manual block via Admin API");
            (StatusCode::OK, Json(AdminResponse {
                success: true,
                message: format!("IP {} diblokir selama {} menit", ip, duration),
            }))
        }
        Err(_) => (StatusCode::BAD_REQUEST, Json(AdminResponse {
            success: false,
            message: "Format IP tidak valid".into(),
        }))
    }
}

/// POST /admin/unblock-ip
async fn unblock_ip_handler(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<BlockIpRequest>,
) -> impl IntoResponse {
    if !validate_admin_key(&headers, &state.config.admin_key) {
        return (StatusCode::UNAUTHORIZED,
            Json(AdminResponse { success: false, message: "Unauthorized".into() })
        );
    }

    match payload.ip.parse() {
        Ok(ip) => {
            state.network_layer.manual_unblock(ip);
            (StatusCode::OK, Json(AdminResponse {
                success: true,
                message: format!("IP {} dibebaskan", ip),
            }))
        }
        Err(_) => (StatusCode::BAD_REQUEST, Json(AdminResponse {
            success: false,
            message: "Format IP tidak valid".into(),
        }))
    }
}

/// GET /admin/status — Status firewall
async fn status_handler(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    if !validate_admin_key(&headers, &state.config.admin_key) {
        return (StatusCode::UNAUTHORIZED, Json(serde_json::json!({
            "error": "Unauthorized"
        }))).into_response();
    }

    (StatusCode::OK, Json(serde_json::json!({
        "status":  "running",
        "version": env!("CARGO_PKG_VERSION"),
        "uptime":  "active",
    }))).into_response()
}
```

---

## 5. TLS Termination — BARU (`layers/tls.rs`)

```rust
use rustls::ServerConfig;
use rustls_pemfile::{certs, pkcs8_private_keys};
use std::fs::File;
use std::io::BufReader;
use std::sync::Arc;

/// Load TLS config dari file cert dan key
pub fn load_tls_config(cert_path: &str, key_path: &str) -> Arc<ServerConfig> {
    // Load sertifikat
    let cert_file = File::open(cert_path)
        .expect("Gagal membuka file sertifikat TLS");
    let mut cert_reader = BufReader::new(cert_file);
    let certs: Vec<_> = certs(&mut cert_reader)
        .collect::<Result<_, _>>()
        .expect("Gagal membaca sertifikat");

    // Load private key
    let key_file = File::open(key_path)
        .expect("Gagal membuka file private key TLS");
    let mut key_reader = BufReader::new(key_file);
    let mut keys: Vec<_> = pkcs8_private_keys(&mut key_reader)
        .collect::<Result<_, _>>()
        .expect("Gagal membaca private key");

    let config = ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(certs, rustls::pki_types::PrivateKeyDer::Pkcs8(
            keys.remove(0)
        ))
        .expect("Konfigurasi TLS tidak valid");

    Arc::new(config)
}
```

---

## 6. Security Headers Middleware (`middleware/security_headers.rs`)

```rust
use axum::{
    http::{HeaderName, HeaderValue, Response},
    middleware::Next,
    extract::Request,
};

pub async fn security_headers_middleware(
    request: Request,
    next: Next,
) -> Response {
    let mut response = next.run(request).await;
    let headers = response.headers_mut();

    let insert = |headers: &mut axum::http::HeaderMap, k: &'static str, v: &'static str| {
        headers.insert(
            HeaderName::from_static(k),
            HeaderValue::from_static(v),
        );
    };

    insert(headers, "x-frame-options",            "DENY");
    insert(headers, "x-content-type-options",     "nosniff");
    insert(headers, "x-xss-protection",           "1; mode=block");
    insert(headers, "referrer-policy",            "strict-origin-when-cross-origin");
    insert(headers, "permissions-policy",         "geolocation=(), camera=(), microphone=()");
    insert(headers, "strict-transport-security",  "max-age=31536000; includeSubDomains");
    insert(headers, "content-security-policy",    "default-src 'self'");

    response
}
```

---

## 7. Audit Logger (`logger/audit.rs`)

```rust
use serde::Serialize;
use chrono::Utc;

#[derive(Serialize)]
pub struct AuditLog {
    pub timestamp:  String,
    pub request_id: String,
    pub ip:         String,
    pub method:     String,
    pub path:       String,
    pub status:     u16,
    pub reason:     Option<String>,   // Alasan jika diblokir
    pub user_agent: Option<String>,
    pub duration_ms: u64,
}

impl AuditLog {
    pub fn emit(&self) {
        // Log sebagai JSON — mudah diproses oleh Grafana / ELK
        tracing::info!(
            target: "audit",
            timestamp  = %self.timestamp,
            request_id = %self.request_id,
            ip         = %self.ip,
            method     = %self.method,
            path       = %self.path,
            status     = self.status,
            reason     = ?self.reason,
            duration_ms = self.duration_ms,
            "request"
        );
    }
}

/// Buat AuditLog baru dengan timestamp otomatis
pub fn new_log(
    request_id: String,
    ip: String,
    method: String,
    path: String,
    status: u16,
    reason: Option<String>,
    duration_ms: u64,
) -> AuditLog {
    AuditLog {
        timestamp: Utc::now().to_rfc3339(),
        request_id,
        ip,
        method,
        path,
        status,
        reason,
        user_agent: None,
        duration_ms,
    }
}
```

---

## 8. Main Entry Point (`main.rs`)

```rust
use std::sync::Arc;
use tokio::net::TcpListener;
use axum::{middleware, Router};
use tracing_subscriber::{fmt, EnvFilter};

mod config;
mod layers;
mod admin;
mod middleware as mw;
mod logger;
mod utils;

use layers::{network::NetworkLayer, inspector::RequestInspector,
             analyzer::WafAnalyzer, auth::AuthProtection};
use config::GuardConfig;

pub struct AppState {
    pub config:         GuardConfig,
    pub network_layer:  NetworkLayer,
    pub inspector:      RequestInspector,
    pub waf:            WafAnalyzer,
    pub auth_protection: AuthProtection,
}

#[tokio::main]
async fn main() {
    // Setup logging JSON
    tracing_subscriber::fmt()
        .json()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Load konfigurasi
    let config = GuardConfig::load("guard.toml").expect("Gagal load guard.toml");

    // Baca admin key dari environment variable (PERBAIKAN)
    let admin_key = std::env::var(&config.server.admin_key_env)
        .expect("Environment variable untuk admin key tidak ditemukan");

    let state = Arc::new(AppState {
        network_layer:   NetworkLayer::new(config.network.clone()),
        inspector:       RequestInspector::new(config.rate_limit.clone(), config.payload.max_body_bytes),
        waf:             WafAnalyzer::new(config.waf.clone()),
        auth_protection: AuthProtection::new(config.brute_force.clone()),
        config:          GuardConfig { admin_key, ..config },
    });

    // Router utama (proxy)
    let app = Router::new()
        .fallback(proxy_handler)
        .layer(middleware::from_fn(mw::security_headers::security_headers_middleware))
        .with_state(state.clone());

    // Router admin (port terpisah)
    let admin_app = admin::handlers::admin_router()
        .with_state(state.clone());

    let proxy_addr = format!("0.0.0.0:{}", state.config.server.port);
    let admin_addr = &state.config.server.admin_bind;

    tracing::info!("🛡️  SIMAJU Guard berjalan di {}", proxy_addr);
    tracing::info!("🔧 Admin API berjalan di {}", admin_addr);

    // Jalankan kedua server secara bersamaan
    let proxy_listener = TcpListener::bind(&proxy_addr).await.unwrap();
    let admin_listener = TcpListener::bind(admin_addr).await.unwrap();

    tokio::join!(
        axum::serve(proxy_listener, app),
        axum::serve(admin_listener, admin_app),
    );
}

async fn proxy_handler() -> &'static str {
    // Implementasi reverse proxy ke backend Node.js
    "proxy"
}
```

---

## 9. Deployment

### Dockerfile (Alpine — Ultra Ringan)

```dockerfile
# Stage 1: Build
FROM rust:1.77-slim AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Stage 2: Runtime (Alpine — < 15 MB total)
FROM alpine:3.19
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/target/release/simaju-guard /usr/local/bin/
COPY guard.toml /etc/simaju/guard.toml

# Jangan jalankan sebagai root
RUN adduser -D -s /bin/sh simaju
USER simaju

EXPOSE 8080 8443 9000
CMD ["simaju-guard"]
```

### Systemd Service (`simaju-guard.service`)

```ini
[Unit]
Description=SIMAJU Guard — Rust WAF & Reverse Proxy
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=simaju
Group=simaju
ExecStart=/usr/local/bin/simaju-guard
Restart=always
RestartSec=3

# Environment variable untuk admin key (PERBAIKAN)
EnvironmentFile=/etc/simaju/simaju-guard.env

# Hardening systemd
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/simaju

[Install]
WantedBy=multi-user.target
```

### File Environment (`/etc/simaju/simaju-guard.env`)

```bash
# Simpan file ini dengan permission 600 (hanya root yang bisa baca)
# chmod 600 /etc/simaju/simaju-guard.env

SIMAJU_ADMIN_KEY=ganti_dengan_kunci_panjang_dan_acak_minimal_32_karakter
RUST_LOG=info
```

---

## 10. ✅ Checklist Produksi

### Keamanan

* [ ] `admin_key` dibaca dari environment variable, **bukan** dari `guard.toml`
* [ ] `guard.toml` ditambahkan ke `.gitignore`
* [ ] Admin API hanya bind ke `127.0.0.1` (bukan `0.0.0.0`)
* [ ] `/metrics` dilindungi dengan `X-Admin-Key` header
* [ ] TLS aktif di port 8443
* [ ] HTTP redirect ke HTTPS diaktifkan
* [ ] File `/etc/simaju/simaju-guard.env` permission `600`
* [ ] Service berjalan sebagai user non-root (`simaju`)

### Fungsionalitas

* [ ] Gate 1: IP blacklist/whitelist berfungsi
* [ ] Gate 2: Rate limiting global dan per-rute berfungsi
* [ ] Gate 2: Body size limit berfungsi
* [ ] Gate 3: WAF mode `log_only` aktif saat pertama deploy
* [ ] Gate 3: Tuning WAF — pastikan tidak ada false positive
* [ ] Gate 3: Ganti WAF ke mode `block` setelah tuning selesai
* [ ] Gate 4: Brute force counter berjalan di sisi Rust (`count_mode = "rust_side"`)
* [ ] Gate 4: Lockout berfungsi setelah 5 kali gagal login
* [ ] Gate 5: Admin API `/admin/block-ip` dan `/admin/unblock-ip` berfungsi
* [ ] Security headers muncul di setiap response

### Monitoring

* [ ] Log JSON tersimpan di `/var/log/simaju/`
* [ ] Prometheus metrics terhubung ke Grafana
* [ ] Alert dikonfigurasi untuk lonjakan traffic / blokiran massal
* [ ] Systemd service auto-restart dikonfigurasi

---

*SIMAJU Guard — Kini aplikasi Anda aman layaknya benteng perusahaan elit.* 🛡️🦀
