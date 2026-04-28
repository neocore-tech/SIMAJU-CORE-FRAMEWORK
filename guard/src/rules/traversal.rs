use regex::Regex;
use once_cell::sync::Lazy;

/// Regex pattern untuk mendeteksi Path Traversal / Directory Traversal
/// Menangkap pola ../, ..\, %2e%2e, dan file sensitif umum (/etc/passwd, win.ini)
static TRAVERSAL_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)(\.\./|\.\.\\|%2e%2e%2f|%2e%2e/|\.\.%2f|%2e%2e%5c|/etc/passwd|/windows/win\.ini)").unwrap()
});

pub fn detect(payload: &str) -> bool {
    TRAVERSAL_PATTERN.is_match(payload)
}
