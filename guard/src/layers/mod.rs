pub mod network;
pub mod inspector;
pub mod analyzer;
pub mod auth;
pub mod tls;

use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use hyper::header::HeaderMap;

pub enum FirewallVerdict {
    Allow,
    Block { reason: String, code: u16 },
}

/// ─────────────────────────────────────────────────────────────
/// Firewall Pipeline
/// Mengecek semua layer secara berurutan. Jika salah satu menolak, 
/// request langsung dipotong tanpa dicek ke layer berikutnya.
/// ─────────────────────────────────────────────────────────────
pub async fn check_all_layers(
    ip: &str,
    path: &str,
    _headers: &HeaderMap,
    body: &[u8],
    config: &Arc<GuardConfig>,
    state: &Arc<AppState>,
) -> FirewallVerdict {
    
    // Layer 1: Network (Blacklist/Whitelist)
    if let FirewallVerdict::Block { reason, code } = network::check_network(ip, config, state).await {
        return FirewallVerdict::Block { reason, code };
    }

    // Layer 2: Inspector (Rate Limit)
    if let FirewallVerdict::Block { reason, code } = inspector::check_inspector(ip, path, body, config, state).await {
        return FirewallVerdict::Block { reason, code };
    }

    // Layer 3: Analyzer (Payload Scanning WAF)
    if let FirewallVerdict::Block { reason, code } = analyzer::check_analyzer(ip, path, body, config, state).await {
        return FirewallVerdict::Block { reason, code };
    }

    // Layer 4: Auth & Brute Force Protection
    if let FirewallVerdict::Block { reason, code } = auth::check_auth(ip, path, config, state).await {
        return FirewallVerdict::Block { reason, code };
    }

    FirewallVerdict::Allow
}
