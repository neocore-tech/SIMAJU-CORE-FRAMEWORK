use dashmap::DashMap;
use std::time::{SystemTime, Duration};

pub struct BruteForceStore {
    failures: DashMap<String, (u32, SystemTime)>,
    locked_ips: DashMap<String, SystemTime>,
}

impl BruteForceStore {
    pub fn new() -> Self {
        Self {
            failures: DashMap::new(),
            locked_ips: DashMap::new(),
        }
    }

    /// Mencatat kegagalan login dan mengunci IP jika melebihi batas
    pub fn record_failure(&self, ip: &str, max_failed: u32, lockout_minutes: u64) {
        let now = SystemTime::now();
        let mut should_lock = false;

        {
            let mut entry = self.failures.entry(ip.to_string()).or_insert((0, now));
            
            // Jika kegagalan sebelumnya sudah lebih dari 1 jam yang lalu, reset konternya
            if now.duration_since(entry.1).unwrap_or(Duration::ZERO) > Duration::from_secs(3600) {
                entry.0 = 0;
            }

            entry.0 += 1;
            entry.1 = now; // update waktu gagal terakhir

            if entry.0 >= max_failed {
                should_lock = true;
                entry.0 = 0; // Reset konter setelah IP dikunci
            }
        }

        if should_lock {
            tracing::warn!("🔒 [BRUTE FORCE] IP {} dikunci selama {} menit karena gagal login berulang kali!", ip, lockout_minutes);
            let locked_until = now + Duration::from_secs(lockout_minutes * 60);
            self.locked_ips.insert(ip.to_string(), locked_until);
        }
    }

    /// Reset counter kegagalan saat login berhasil
    pub fn reset_failure(&self, ip: &str) {
        self.failures.remove(ip);
        self.locked_ips.remove(ip);
    }

    /// Mengecek apakah sebuah IP sedang dalam masa hukuman (lockout)
    pub fn is_locked(&self, ip: &str) -> bool {
        if let Some(locked_until) = self.locked_ips.get(ip) {
            if SystemTime::now() < *locked_until {
                return true;
            } else {
                // Masa hukuman habis, abaikan (terhapus otomatis nanti saat lazy-sweep)
                return false;
            }
        }
        false
    }
}
