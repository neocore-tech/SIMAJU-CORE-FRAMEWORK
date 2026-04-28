use regex::Regex;
use once_cell::sync::Lazy;

/// Regex pattern untuk mendeteksi SQL Injection
/// Menangkap pola seperti UNION SELECT, drop table, OR 1=1, dan komentar SQL (--, /* */)
static SQLI_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)(\b(union|select|insert|update|delete|drop|alter|create|truncate|exec|execute)\b.*\b(from|into|table|database|where)\b)|(--\s|#\s|/\*.*\*/)|(\b(or|and)\b\s+['\w]+\s*=\s*['\w]+)|(;.*--)").unwrap()
});

pub fn detect(payload: &str) -> bool {
    SQLI_PATTERN.is_match(payload)
}
