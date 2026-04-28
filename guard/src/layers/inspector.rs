use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use crate::layers::FirewallVerdict;

/// ─────────────────────────────────────────────────────────────
/// Layer 2: Request Inspector
/// Memeriksa batas kewajaran request (Rate Limiting)
/// ─────────────────────────────────────────────────────────────
pub async fn check_inspector(
    ip: &str,
    path: &str,
    _body: &[u8], // Body size sudah dicek di proxy.rs, bisa dicek hal lain di sini
    config: &Arc<GuardConfig>,
    state: &Arc<AppState>,
) -> FirewallVerdict {
    
    // Cek Rate Limit
    if config.rate_limit.enabled {
        
        // Cari tau apakah endpoint/route ini punya rate limit khusus
        // Jika tidak ada, gunakan default global
        let (limit, window) = match config.rate_limit.routes.get(path) {
            Some(route_conf) => (route_conf.max, route_conf.window),
            None => (config.rate_limit.requests_per_window, config.rate_limit.window_seconds),
        };

        let burst = config.rate_limit.burst;
        
        // Buat kunci unik: kombinasi IP dan Path (agar spam di 1 path tidak mematikan path lain)
        let rate_key = format!("{}:{}", ip, path);

        if !state.rate_store.check_rate_limit(&rate_key, limit, window, burst) {
            tracing::warn!("⏳ [RATE LIMIT] Terlampaui untuk IP {} pada endpoint {}", ip, path);
            
            // Catat sebagai pelanggaran (Bisa memicu auto-block jika terlalu sering spam)
            state.ip_list.record_attack(ip, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);

            return FirewallVerdict::Block {
                reason: "Too Many Requests (Rate Limit Exceeded)".to_string(),
                code: 429,
            };
        }
    }

    FirewallVerdict::Allow
}
