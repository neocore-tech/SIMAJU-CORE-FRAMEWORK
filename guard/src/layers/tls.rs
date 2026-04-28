use rustls::ServerConfig;
use rustls_pemfile::{certs, pkcs8_private_keys};
use std::fs::File;
use std::io::BufReader;
use std::sync::Arc;

/// Load TLS config dari file cert dan key
pub fn load_tls_config(cert_path: &str, key_path: &str) -> Result<Arc<ServerConfig>, Box<dyn std::error::Error>> {
    // Load sertifikat
    let cert_file = File::open(cert_path)?;
    let mut cert_reader = BufReader::new(cert_file);
    let certs: Vec<_> = certs(&mut cert_reader)
        .collect::<Result<_, _>>()?;

    // Load private key
    let key_file = File::open(key_path)?;
    let mut key_reader = BufReader::new(key_file);
    let mut keys: Vec<_> = pkcs8_private_keys(&mut key_reader)
        .collect::<Result<_, _>>()?;

    if keys.is_empty() {
        return Err("Tidak ada private key yang ditemukan (harus PKCS8)".into());
    }

    let config = ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(certs, rustls::pki_types::PrivateKeyDer::Pkcs8(
            keys.remove(0)
        ))?;

    Ok(Arc::new(config))
}
