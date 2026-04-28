use axum::{
    routing::{get, post},
    Router,
    middleware,
};
use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use super::handlers;

pub fn create_router(config: Arc<GuardConfig>, state: Arc<AppState>) -> Router {
    let app_state = handlers::AdminState {
        config: config.clone(),
        store: state,
    };

    Router::new()
        .route("/admin/status", get(handlers::get_status))
        .route("/admin/stats", get(handlers::get_stats))
        .route("/admin/blocked-ips", get(handlers::get_blocked_ips))
        .route("/admin/block-ip", post(handlers::block_ip))
        .route("/admin/unblock-ip", post(handlers::unblock_ip))
        .route("/metrics", get(handlers::get_metrics))
        .with_state(app_state)
        // Pasang middleware pelindung Admin API Key
        .route_layer(middleware::from_fn_with_state(config, handlers::auth_middleware))
}
