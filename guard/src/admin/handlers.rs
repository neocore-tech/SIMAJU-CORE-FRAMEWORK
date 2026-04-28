use axum::{
    extract::State,
    http::{Request, StatusCode, HeaderMap},
    response::IntoResponse,
    Json,
    middleware::Next,
};
use serde_json::{json, Value};
use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use prometheus::{Encoder, TextEncoder};
use serde::Deserialize;

#[derive(Clone)]
#[allow(dead_code)]
pub struct AdminState {
    pub config: Arc<GuardConfig>,
    pub store: Arc<AppState>,
}

#[derive(Deserialize)]
pub struct IpPayload {
    pub ip: String,
}

/// Middleware untuk mengecek Admin API Key
pub async fn auth_middleware(
    State(config): State<Arc<GuardConfig>>,
    headers: HeaderMap,
    request: Request<axum::body::Body>,
    next: Next,
) -> Result<impl IntoResponse, StatusCode> {
    
    // Bypass auth untuk /metrics agar bisa di-scrape oleh Prometheus
    if request.uri().path() == "/metrics" {
        return Ok(next.run(request).await);
    }

    let auth_header = headers.get("x-admin-key").and_then(|h| h.to_str().ok());
    if auth_header != Some(&config.server.admin_key) {
        tracing::warn!("🛡️ [ADMIN] Upaya akses Admin API ditolak (Key salah/kosong)");
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(next.run(request).await)
}

pub async fn get_status() -> Json<Value> {
    Json(json!({
        "status": "online",
        "service": "SIMAJU Guard Firewall",
        "version": "1.0.0"
    }))
}

pub async fn get_stats(_state: State<AdminState>) -> Json<Value> {
    let total_req = crate::metrics::TOTAL_REQUESTS.get();
    let blocked_req = crate::metrics::BLOCKED_REQUESTS.get();
    
    Json(json!({
        "total_requests": total_req,
        "blocked_requests": blocked_req,
    }))
}

pub async fn get_blocked_ips(State(state): State<AdminState>) -> Json<Value> {
    let ips = state.store.ip_list.get_all_blocked();
    Json(json!({
        "blocked_ips": ips
    }))
}

pub async fn block_ip(State(state): State<AdminState>, Json(payload): Json<IpPayload>) -> Json<Value> {
    state.store.ip_list.manual_block(&payload.ip);
    Json(json!({"success": true, "message": format!("IP {} berhasil diblokir manual", payload.ip)}))
}

pub async fn unblock_ip(State(state): State<AdminState>, Json(payload): Json<IpPayload>) -> Json<Value> {
    state.store.ip_list.manual_unblock(&payload.ip);
    Json(json!({"success": true, "message": format!("IP {} berhasil dihapus dari daftar blokir", payload.ip)}))
}

pub async fn get_metrics() -> impl IntoResponse {
    let encoder = TextEncoder::new();
    let mut buffer = vec![];
    let metric_families = prometheus::gather();
    encoder.encode(&metric_families, &mut buffer).unwrap();
    String::from_utf8(buffer).unwrap()
}
