use dashmap::{DashMap, DashSet};
use std::time::{SystemTime, Duration};

pub struct IpListStore {
    manual_blacklist: DashSet<String>,
    manual_whitelist: DashSet<String>,
    auto_blocked: DashMap<String, SystemTime>,
    attack_counts: DashMap<String, (u32, SystemTime)>,
}

impl IpListStore {
    pub fn new() -> Self {
        Self {
            manual_blacklist: DashSet::new(),
            manual_whitelist: DashSet::new(),
            auto_blocked: DashMap::new(),
            attack_counts: DashMap::new(),
        }
    }

    pub fn load_from_config(&self, blacklist: &[String], whitelist: &[String]) {
        for ip in blacklist {
            self.manual_blacklist.insert(ip.clone());
        }
        for ip in whitelist {
            self.manual_whitelist.insert(ip.clone());
        }
    }

    pub fn is_whitelisted(&self, ip: &str) -> bool {
        self.manual_whitelist.contains(ip)
    }

    pub fn is_blacklisted(&self, ip: &str) -> bool {
        if self.manual_blacklist.contains(ip) {
            return true;
        }

        // Cek masa berlaku blokir otomatis
        if let Some(blocked_until) = self.auto_blocked.get(ip) {
            if SystemTime::now() < *blocked_until {
                return true;
            } else {
                // Hapus otomatis jika masa blokir habis (dihandle malas / lazy deletion)
            }
        }
        false
    }

    pub fn record_attack(&self, ip: &str, limit: u32, block_minutes: u64) {
        if self.is_whitelisted(ip) { return; }

        let now = SystemTime::now();
        let mut should_block = false;

        {
            let mut entry = self.attack_counts.entry(ip.to_string()).or_insert((0, now));
            
            // Reset konter jika serangan pertama lebih dari 1 jam lalu
            if now.duration_since(entry.1).unwrap_or(Duration::ZERO) > Duration::from_secs(3600) {
                entry.0 = 0;
                entry.1 = now;
            }

            entry.0 += 1;

            if entry.0 >= limit {
                should_block = true;
                entry.0 = 0; // Reset konter setelah diblokir
            }
        }

        if should_block {
            tracing::warn!("🛡️ [GUARD] IP {} di-blokir otomatis selama {} menit karena serangan berulang!", ip, block_minutes);
            let blocked_until = now + Duration::from_secs(block_minutes * 60);
            self.auto_blocked.insert(ip.to_string(), blocked_until);
        }
    }

    pub fn manual_block(&self, ip: &str) {
        self.manual_blacklist.insert(ip.to_string());
    }

    pub fn manual_unblock(&self, ip: &str) {
        self.manual_blacklist.remove(ip);
        self.auto_blocked.remove(ip);
    }

    pub fn get_all_blocked(&self) -> Vec<String> {
        let mut list = Vec::new();
        for item in self.manual_blacklist.iter() {
            list.push(format!("{} (manual-block)", item.key()));
        }
        let now = SystemTime::now();
        for item in self.auto_blocked.iter() {
            if now < *item.value() {
                list.push(format!("{} (auto-blocked)", item.key()));
            }
        }
        list
    }
}
