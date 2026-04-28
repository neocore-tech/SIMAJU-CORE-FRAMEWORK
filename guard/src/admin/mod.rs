pub mod routes;
pub mod handlers;

use std::sync::Arc;
use crate::config::GuardConfig;
use crate::store::AppState;
use std::net::SocketAddr;
use tokio::net::TcpListener;

pub async fn start_admin_server(config: Arc<GuardConfig>, state: Arc<AppState>) {
    let port = config.server.admin_port;
    
    // Bind ke localhost (127.0.0.1) agar tidak bisa diakses dari internet secara langsung
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    
    let app = routes::create_router(config, state);

    match TcpListener::bind(addr).await {
        Ok(listener) => {
            tracing::info!("🛠️  Admin API & Metrics listening on http://{}", addr);
            if let Err(e) = axum::serve(listener, app).await {
                tracing::error!("Admin server error: {}", e);
            }
        }
        Err(e) => {
            tracing::error!("Gagal menjalankan Admin API di port {}: {}", port, e);
        }
    }
}
