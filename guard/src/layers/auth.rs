use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use crate::layers::FirewallVerdict;

/// ─────────────────────────────────────────────────────────────
/// Layer 4: Auth & Brute Force Protection
/// Mencegah bot/hacker mencoba menebak password (Brute Force)
/// secara terus-menerus ke halaman Login.
/// ─────────────────────────────────────────────────────────────
pub async fn check_auth(
    ip: &str,
    path: &str,
    config: &Arc<GuardConfig>,
    state: &Arc<AppState>,
) -> FirewallVerdict {
    
    // Pastikan fitur ini dihidupkan di konfigurasi
    if config.brute_force.enabled {
        
        // Pengecekan HANYA berlaku jika request mengarah ke route login
        if path == config.brute_force.login_route {
            
            // Cek apakah IP ini sedang dihukum karena sebelumnya terlalu banyak gagal
            if state.brute_store.is_locked(ip) {
                tracing::warn!("🚫 [AUTH] Akses login ditolak untuk IP {} (sedang dalam masa lockout brute force)", ip);
                return FirewallVerdict::Block { 
                    reason: format!("Account locked due to multiple failed login attempts. Please try again after {} minutes.", config.brute_force.lockout_minutes), 
                    code: 403 
                };
            }
        }
    }

    // Catatan: JWT Pre-Verify bisa ditambahkan di sini nantinya untuk menolak
    // JWT palsu langsung di Rust, sehingga Node.js sama sekali tidak terbebani.

    FirewallVerdict::Allow
}
