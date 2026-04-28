use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use crate::layers::FirewallVerdict;
use crate::rules::{sqli, xss, traversal, cmd_inject};

/// ─────────────────────────────────────────────────────────────
/// Layer 3: Payload Analyzer
/// Memeriksa isi request (URL Path + Body) terhadap serangan
/// SQL Injection, XSS, Path Traversal, dll.
/// ─────────────────────────────────────────────────────────────
pub async fn check_analyzer(
    ip: &str,
    path: &str,
    body: &[u8],
    config: &Arc<GuardConfig>,
    state: &Arc<AppState>,
) -> FirewallVerdict {
    
    // Cek whitelist routes
    for r in &config.payload.whitelist_routes {
        if path.starts_with(r) {
            return FirewallVerdict::Allow;
        }
    }

    // Konversi body ke string (jika ada karakter non-UTF8, otomatis diganti)
    let body_str = String::from_utf8_lossy(body);
    
    // Gabungkan URL Path dan Request Body untuk dipindai oleh engine Regex sekaligus
    let payload_to_scan = format!("{} {}", path, body_str);

    let mut threats = Vec::new();

    // 1. Cek SQL Injection
    if config.payload.detect_sqli && sqli::detect(&payload_to_scan) {
        threats.push("SQL Injection");
    }

    // 2. Cek XSS
    if config.payload.detect_xss && xss::detect(&payload_to_scan) {
        threats.push("Cross-Site Scripting");
    }

    // 3. Cek Path Traversal
    if config.payload.detect_traversal && traversal::detect(&payload_to_scan) {
        threats.push("Directory Traversal");
    }

    // 4. Cek OS Command Injection
    if config.payload.detect_command_injection && cmd_inject::detect(&payload_to_scan) {
        threats.push("Command Injection");
    }

    if !threats.is_empty() {
        let reason = format!("Malicious Payload Detected ({})", threats.join(", "));
        tracing::warn!("🛡️ [ANALYZER] Terdeteksi {} dari IP {} pada {}", threats.join(", "), ip, path);
        
        state.ip_list.record_attack(ip, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);

        if config.payload.mode == "block" {
            return FirewallVerdict::Block { reason, code: 403 };
        } else {
            tracing::info!("🛡️ [ANALYZER] Mode WAF log_only, mengizinkan request dari IP {}", ip);
        }
    }

    FirewallVerdict::Allow
}
