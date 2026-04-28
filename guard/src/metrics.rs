use prometheus::{IntCounter, Registry};
use once_cell::sync::Lazy;

pub static REGISTRY: Lazy<Registry> = Lazy::new(|| {
    Registry::new()
});

pub static TOTAL_REQUESTS: Lazy<IntCounter> = Lazy::new(|| {
    let counter = IntCounter::new("guard_requests_total", "Total incoming requests").unwrap();
    REGISTRY.register(Box::new(counter.clone())).unwrap();
    counter
});

pub static BLOCKED_REQUESTS: Lazy<IntCounter> = Lazy::new(|| {
    let counter = IntCounter::new("guard_requests_blocked_total", "Total blocked requests").unwrap();
    REGISTRY.register(Box::new(counter.clone())).unwrap();
    counter
});
