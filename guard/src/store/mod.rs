pub mod ip_list;
pub mod brute_store;
pub mod rate_store;

use std::sync::Arc;
use ip_list::IpListStore;
use brute_store::BruteForceStore;
use rate_store::RateLimitStore;

/// ─────────────────────────────────────────────────────────────
/// State Aplikasi Guard (In-Memory)
/// ─────────────────────────────────────────────────────────────
pub struct AppState {
    pub ip_list: Arc<IpListStore>,
    pub brute_store: Arc<BruteForceStore>,
    pub rate_store: Arc<RateLimitStore>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            ip_list: Arc::new(IpListStore::new()),
            brute_store: Arc::new(BruteForceStore::new()),
            rate_store: Arc::new(RateLimitStore::new()),
        }
    }
}
