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
    
    // Konversi body ke string (jika ada karakter non-UTF8, otomatis diganti)
    let body_str = String::from_utf8_lossy(body);
    
    // Gabungkan URL Path dan Request Body untuk dipindai oleh engine Regex sekaligus
    let payload_to_scan = format!("{} {}", path, body_str);

    // 1. Cek SQL Injection
    if config.payload.detect_sqli && sqli::detect(&payload_to_scan) {
        tracing::warn!("🛡️ [ANALYZER] Terdeteksi SQL Injection dari IP {} pada {}", ip, path);
        state.ip_list.record_attack(ip, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);
        return FirewallVerdict::Block { reason: "Malicious Payload Detected (SQL Injection)".to_string(), code: 403 };
    }

    // 2. Cek XSS
    if config.payload.detect_xss && xss::detect(&payload_to_scan) {
        tracing::warn!("🛡️ [ANALYZER] Terdeteksi XSS dari IP {} pada {}", ip, path);
        state.ip_list.record_attack(ip, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);
        return FirewallVerdict::Block { reason: "Malicious Payload Detected (Cross-Site Scripting)".to_string(), code: 403 };
    }

    // 3. Cek Path Traversal
    if config.payload.detect_traversal && traversal::detect(&payload_to_scan) {
        tracing::warn!("🛡️ [ANALYZER] Terdeteksi Path Traversal dari IP {} pada {}", ip, path);
        state.ip_list.record_attack(ip, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);
        return FirewallVerdict::Block { reason: "Malicious Payload Detected (Directory Traversal)".to_string(), code: 403 };
    }

    // 4. Cek OS Command Injection
    if config.payload.detect_command_injection && cmd_inject::detect(&payload_to_scan) {
        tracing::warn!("🛡️ [ANALYZER] Terdeteksi OS Command Injection dari IP {} pada {}", ip, path);
        state.ip_list.record_attack(ip, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);
        return FirewallVerdict::Block { reason: "Malicious Payload Detected (Command Injection)".to_string(), code: 403 };
    }

    FirewallVerdict::Allow
}
