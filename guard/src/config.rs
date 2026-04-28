#![allow(dead_code)]

use serde::Deserialize;
use std::collections::HashMap;
use std::fs;

/// ─────────────────────────────────────────────────────────────
/// Config — Struktur konfigurasi SIMAJU Guard
/// Dibaca dari guard.toml
/// ─────────────────────────────────────────────────────────────

#[derive(Debug, Deserialize, Clone)]
pub struct GuardConfig {
    pub server:      ServerConfig,
    pub upstream:    UpstreamConfig,
    pub rate_limit:  RateLimitConfig,
    pub ip:          IpConfig,
    pub geoip:       GeoIpConfig,
    pub payload:     PayloadConfig,
    pub brute_force: BruteForceConfig,
    pub jwt:         JwtConfig,
    pub tls:         TlsConfig,
    pub logging:     LoggingConfig,
    pub metrics:     MetricsConfig,
}

#[derive(Debug, Deserialize, Clone)]
pub struct ServerConfig {
    pub port:       u16,
    pub tls_port:   u16,
    pub admin_port: u16,
    #[serde(default = "default_admin_key_env")]
    pub admin_key_env: String,
    #[serde(default)]
    pub admin_key:  String,
}

fn default_admin_key_env() -> String { "SIMAJU_ADMIN_KEY".to_string() }

#[derive(Debug, Deserialize, Clone)]
pub struct UpstreamConfig {
    pub target:          String,
    pub timeout_ms:      u64,
    pub max_connections: u32,
    pub health_path:     String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct RateLimitConfig {
    pub enabled:             bool,
    pub requests_per_window: u32,
    pub window_seconds:      u64,
    pub burst:               u32,
    #[serde(default)]
    pub routes:              HashMap<String, RouteRateLimit>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct RouteRateLimit {
    pub max:    u32,
    pub window: u64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct IpConfig {
    pub mode:                     String, // "blacklist" | "whitelist"
    pub blacklist:                Vec<String>,
    pub whitelist:                Vec<String>,
    pub auto_block_after_attacks: u32,
    pub auto_block_minutes:       u64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct GeoIpConfig {
    pub enabled:          bool,
    pub db_path:          String,
    pub blocked_countries: Vec<String>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct PayloadConfig {
    pub max_body_size_kb:         u64,
    #[serde(default = "default_waf_mode")]
    pub mode:                     String,
    #[serde(default)]
    pub whitelist_routes:         Vec<String>,
    pub detect_sqli:              bool,
    pub detect_xss:               bool,
    pub detect_traversal:         bool,
    pub detect_command_injection: bool,
}

fn default_waf_mode() -> String { "log_only".to_string() }

#[derive(Debug, Deserialize, Clone)]
pub struct BruteForceConfig {
    pub enabled:         bool,
    pub max_failed:      u32,
    pub lockout_minutes: u64,
    pub login_route:     String,
    #[serde(default = "default_count_mode")]
    pub count_mode:      String,
}

fn default_count_mode() -> String { "rust_side".to_string() }

#[derive(Debug, Deserialize, Clone)]
pub struct JwtConfig {
    pub pre_verify: bool,
    pub secret:     String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct TlsConfig {
    pub cert_file:      String,
    pub key_file:       String,
    pub http_redirect:  bool,
}

#[derive(Debug, Deserialize, Clone)]
pub struct LoggingConfig {
    pub level:  String,
    pub format: String,
    pub file:   String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct MetricsConfig {
    pub enabled:  bool,
    pub endpoint: String,
}

impl GuardConfig {
    /// Load konfigurasi dari file TOML
    pub fn load(path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(path)
            .map_err(|e| format!("Gagal membaca {}: {}", path, e))?;

        let mut config: GuardConfig = toml::from_str(&content)
            .map_err(|e| format!("Gagal parse {}: {}", path, e))?;

        if let Ok(env_key) = std::env::var(&config.server.admin_key_env) {
            config.server.admin_key = env_key;
        }

        config.validate()?;
        Ok(config)
    }

    /// Validasi nilai-nilai konfigurasi
    fn validate(&self) -> Result<(), Box<dyn std::error::Error>> {
        if self.server.admin_key.is_empty() || self.server.admin_key == "GANTI_DENGAN_KEY_AMAN_DISINI" {
            eprintln!("⚠️  PERINGATAN: admin_key masih menggunakan nilai default atau kosong! Ganti di guard.toml atau set env {}", self.server.admin_key_env);
        }

        if self.upstream.target.is_empty() {
            return Err("upstream.target tidak boleh kosong".into());
        }

        if !["blacklist", "whitelist"].contains(&self.ip.mode.as_str()) {
            return Err(format!("ip.mode harus 'blacklist' atau 'whitelist', bukan '{}'", self.ip.mode).into());
        }

        Ok(())
    }
}
