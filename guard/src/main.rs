use std::net::SocketAddr;
use std::sync::Arc;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request};
use hyper::body::Incoming;
use hyper_util::rt::TokioIo;
use tokio::net::TcpListener;
use tracing::{info, error, Level};
use tracing_subscriber::FmtSubscriber;

mod config;
mod proxy;
mod store;
mod rules;
mod layers;
mod metrics;
mod admin;

use config::GuardConfig;
use store::AppState;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // 1. Setup Logging (Tracing)
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)
        .expect("Gagal setup tracing subscriber");

    info!("Memulai SIMAJU Guard...");

    // 2. Load Config
    let config = GuardConfig::load("guard.toml").unwrap_or_else(|e| {
        error!("Gagal load config: {}", e);
        std::process::exit(1);
    });
    let config = Arc::new(config);

    // 3. Initialize In-Memory State
    let state = Arc::new(AppState::new());

    // Load blacklist/whitelist dari file konfigurasi guard.toml
    state.ip_list.load_from_config(&config.ip.blacklist, &config.ip.whitelist);

    // 4. Setup TCP Listener
    let addr = SocketAddr::from(([0, 0, 0, 0], config.server.port));
    let listener = match TcpListener::bind(addr).await {
        Ok(l) => l,
        Err(e) => {
            error!("Gagal bind ke port {}: {}", config.server.port, e);
            std::process::exit(1);
        }
    };
    
    info!("🛡️  SIMAJU Guard listening on http://{}", addr);
    info!("🚀 Forwarding traffic ke upstream: {}", config.upstream.target);

    // 5. Jalankan Admin Server di background
    let admin_config = Arc::clone(&config);
    let admin_state = Arc::clone(&state);
    tokio::spawn(async move {
        admin::start_admin_server(admin_config, admin_state).await;
    });

    // 6. Accept connections loop (Main Server)
    loop {
        let (stream, client_addr) = listener.accept().await?;
        let io = TokioIo::new(stream);
        let config_clone = Arc::clone(&config);
        let state_clone = Arc::clone(&state);

        // Spawn task untuk setiap koneksi (Concurrent)
        tokio::task::spawn(async move {
            let service = service_fn(move |req: Request<Incoming>| {
                proxy::handle_request(req, client_addr, Arc::clone(&config_clone), Arc::clone(&state_clone))
            });

            if let Err(err) = http1::Builder::new().serve_connection(io, service).await {
                error!("Error serving connection: {:?}", err);
            }
        });
    }
}
