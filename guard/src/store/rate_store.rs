use dashmap::DashMap;
use std::time::{SystemTime, Duration};

#[derive(Clone)]
struct Bucket {
    tokens: f32,
    last_updated: SystemTime,
}

pub struct RateLimitStore {
    // Key format: "IP:Route" -> Bucket
    buckets: DashMap<String, Bucket>,
}

impl RateLimitStore {
    pub fn new() -> Self {
        Self {
            buckets: DashMap::new(),
        }
    }

    /// Token Bucket Algorithm untuk Rate Limiting
    /// Return true jika request diizinkan, false jika ditolak (Rate Limited)
    pub fn check_rate_limit(&self, key: &str, limit: u32, window_secs: u64, burst: u32) -> bool {
        let now = SystemTime::now();
        let rate = limit as f32 / window_secs as f32; // Jumlah token yang diisi per detik

        let mut bucket = self.buckets.entry(key.to_string()).or_insert_with(|| Bucket {
            tokens: burst as f32,
            last_updated: now,
        });

        // Hitung berapa token yang bisa ditambahkan sejak akses terakhir
        let elapsed = now.duration_since(bucket.last_updated).unwrap_or(Duration::ZERO).as_secs_f32();
        
        bucket.tokens += elapsed * rate;
        
        // Tidak boleh melebihi kapasitas burst maksimal
        if bucket.tokens > burst as f32 {
            bucket.tokens = burst as f32;
        }
        bucket.last_updated = now;

        // Coba konsumsi 1 token
        if bucket.tokens >= 1.0 {
            bucket.tokens -= 1.0;
            true // Diizinkan
        } else {
            false // Ditolak (Rate Limit Tercapai)
        }
    }
}
