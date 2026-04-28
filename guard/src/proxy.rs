use bytes::Bytes;
use http_body_util::{BodyExt, Full};
use hyper::{Request, Response, StatusCode};
use hyper::body::Incoming;
use std::net::SocketAddr;
use std::sync::Arc;
use tracing::{info, warn, error};
use uuid::Uuid;

use crate::config::GuardConfig;
use crate::store::AppState;
use crate::layers::{FirewallVerdict, check_all_layers};

/// ─────────────────────────────────────────────────────────────
/// Proxy — Core reverse proxy logic
/// Terima request → cek semua layer → forward ke upstream
/// ─────────────────────────────────────────────────────────────

pub type BoxError = Box<dyn std::error::Error + Send + Sync>;

/// Handle setiap incoming request
pub async fn handle_request(
    req:         Request<Incoming>,
    client_ip:   SocketAddr,
    config:      Arc<GuardConfig>,
    state:       Arc<AppState>,
) -> Result<Response<Full<Bytes>>, BoxError> {

    let request_id = Uuid::new_v4().to_string();
    let method     = req.method().clone();
    let uri        = req.uri().clone();
    let ip_str     = client_ip.ip().to_string();

    info!(
        request_id = %request_id,
        method     = %method,
        uri        = %uri,
        ip         = %ip_str,
        "→ Incoming request"
    );

    // ── Baca body request (untuk inspeksi payload) ─────────────
    let (parts, body) = req.into_parts();
    let body_bytes = match body.collect().await {
        Ok(collected) => collected.to_bytes(),
        Err(e) => {
            error!("Gagal membaca body request: {}", e);
            return Ok(error_response(StatusCode::BAD_REQUEST, "Bad Request"));
        }
    };

    // Cek ukuran body
    let max_bytes = (config.payload.max_body_size_kb * 1024) as usize;
    if body_bytes.len() > max_bytes {
        warn!(ip = %ip_str, size = body_bytes.len(), "Request body terlalu besar");
        return Ok(error_response(StatusCode::PAYLOAD_TOO_LARGE, "Payload Too Large"));
    }

    // ── Cek semua layer firewall ───────────────────────────────
    let path = parts.uri.path().to_string();
    let headers = &parts.headers;

    crate::metrics::TOTAL_REQUESTS.inc();

    match check_all_layers(&ip_str, &path, headers, &body_bytes, &config, &state).await {
        FirewallVerdict::Allow => {
            // Request aman — forward ke upstream
        }
        FirewallVerdict::Block { reason, code } => {
            warn!(
                request_id = %request_id,
                ip         = %ip_str,
                uri        = %uri,
                reason     = %reason,
                code       = %code,
                "✗ Request DIBLOKIR"
            );
            // Tambah attack counter untuk IP ini
            state.ip_list.record_attack(&ip_str, config.ip.auto_block_after_attacks, config.ip.auto_block_minutes);
            crate::metrics::BLOCKED_REQUESTS.inc();
            return Ok(error_response(StatusCode::from_u16(code).unwrap_or(StatusCode::FORBIDDEN), &reason));
        }
    }

    // ── Forward ke upstream (Node.js) ─────────────────────────
    let upstream_url = format!(
        "{}{}",
        config.upstream.target.trim_end_matches('/'),
        uri
    );

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_millis(config.upstream.timeout_ms))
        .build()?;

    // Rebuild request ke upstream
    let mut upstream_req = client.request(
        reqwest::Method::from_bytes(method.as_str().as_bytes())?,
        &upstream_url,
    );

    // Forward semua headers asli
    for (name, value) in headers.iter() {
        // Skip hop-by-hop headers
        if !is_hop_by_hop(name.as_str()) {
            if let Ok(v) = value.to_str() {
                upstream_req = upstream_req.header(name.as_str(), v);
            }
        }
    }

    // Tambahkan header Guard
    upstream_req = upstream_req
        .header("X-Forwarded-For",  &ip_str)
        .header("X-Real-IP",        &ip_str)
        .header("X-Guard-Request",  &request_id)
        .body(body_bytes.to_vec());

    match upstream_req.send().await {
        Ok(upstream_resp) => {
            let status  = upstream_resp.status();
            let headers_map = upstream_resp.headers().clone();
            let body    = upstream_resp.bytes().await.unwrap_or_default();

            info!(
                request_id = %request_id,
                status     = %status,
                "← Upstream response"
            );

            // Jika login gagal → catat untuk brute force detection
            if path == config.brute_force.login_route && status == reqwest::StatusCode::UNAUTHORIZED {
                state.brute_store.record_failure(&ip_str, config.brute_force.max_failed, config.brute_force.lockout_minutes);
            }

            // Build response balik ke client
            let mut response = Response::builder()
                .status(status.as_u16());

            // Forward headers dari upstream
            if let Some(h) = response.headers_mut() {
                for (name, value) in &headers_map {
                    if !is_hop_by_hop(name.as_str()) {
                        h.insert(name, value.clone());
                    }
                }
                h.insert("X-Protected-By", "SIMAJU Guard".parse().unwrap());
            }

            Ok(response.body(Full::new(Bytes::from(body)))?)
        }
        Err(e) => {
            error!(request_id = %request_id, error = %e, "Upstream tidak bisa dihubungi");
            Ok(error_response(StatusCode::BAD_GATEWAY, "Upstream Unavailable"))
        }
    }
}

/// Build response error JSON
pub fn error_response(status: StatusCode, message: &str) -> Response<Full<Bytes>> {
    let body = serde_json::json!({
        "success": false,
        "error":   message,
        "code":    status.as_u16(),
    })
    .to_string();

    Response::builder()
        .status(status)
        .header("Content-Type", "application/json")
        .header("X-Protected-By", "SIMAJU Guard")
        .body(Full::new(Bytes::from(body)))
        .unwrap()
}

/// Daftar hop-by-hop headers yang tidak perlu di-forward
fn is_hop_by_hop(name: &str) -> bool {
    matches!(
        name.to_lowercase().as_str(),
        "connection" | "keep-alive" | "proxy-authenticate" |
        "proxy-authorization" | "te" | "trailers" |
        "transfer-encoding" | "upgrade"
    )
}
