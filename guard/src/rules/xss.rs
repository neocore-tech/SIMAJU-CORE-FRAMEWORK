use regex::Regex;
use once_cell::sync::Lazy;

/// Regex pattern untuk mendeteksi Cross-Site Scripting (XSS)
/// Menangkap tag <script>, event handler (onerror, onload), dan skema berbahaya (javascript:, vbscript:)
static XSS_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)(<script.*?>.*?</script>)|(<.*?on\w+\s*=.*?>)|(javascript:)|(vbscript:)|(<iframe.*?>)|(<object.*?>)|(<applet.*?>)|(<embed.*?>)").unwrap()
});

pub fn detect(payload: &str) -> bool {
    XSS_PATTERN.is_match(payload)
}
