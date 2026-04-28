use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use crate::layers::FirewallVerdict;

/// ─────────────────────────────────────────────────────────────
/// Layer 1: Network Guard
/// Memeriksa daftar blokir IP (Blacklist / Whitelist)
/// ─────────────────────────────────────────────────────────────
pub async fn check_network(ip: &str, config: &Arc<GuardConfig>, state: &Arc<AppState>) -> FirewallVerdict {
    
    // 1. Cek Whitelist Manual (Bypass semua pengecekan)
    if state.ip_list.is_whitelisted(ip) {
        return FirewallVerdict::Allow;
    }

    // 2. Jika konfigurasi di set ke Mode "Whitelist Only"
    if config.ip.mode == "whitelist" {
        return FirewallVerdict::Block {
            reason: "Access Denied: Guard is in Strict Whitelist Mode".to_string(),
            code: 403,
        };
    }

    // 3. Cek Blacklist (Manual & Auto-Block dari serangan sebelumnya)
    if state.ip_list.is_blacklisted(ip) {
        return FirewallVerdict::Block {
            reason: "Access Denied: Your IP has been blocked by SIMAJU Guard".to_string(),
            code: 403,
        };
    }

    // Catatan: GeoIP Blocking bisa ditambahkan di sini pada pengembangan berikutnya

    FirewallVerdict::Allow
}
