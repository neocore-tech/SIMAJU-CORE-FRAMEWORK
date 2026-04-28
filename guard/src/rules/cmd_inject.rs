use regex::Regex;
use once_cell::sync::Lazy;

/// Regex pattern untuk mendeteksi OS Command Injection
/// Menangkap injeksi separator command (; atau | atau `) diikuti dengan command linux umum
static CMD_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)(;\s*(ls|cat|rm|wget|curl|ping|nc|bash|sh|php|python|perl)\b)|(\|\s*(ls|cat|rm|wget|curl|ping|nc|bash|sh|php|python|perl)\b)|(`.*(ls|cat|rm|wget|curl|ping|nc|bash|sh|php|python|perl)\b.*`)").unwrap()
});

pub fn detect(payload: &str) -> bool {
    CMD_PATTERN.is_match(payload)
}
