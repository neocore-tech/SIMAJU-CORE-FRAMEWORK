# 🛡️ SIMAJU Guard (Rust Firewall)

**SIMAJU Guard** is an Ultra-High Performance Web Application Firewall (WAF) and Reverse Proxy built entirely in **Rust**.

SIMAJU Guard acts as the "Gatekeeper" standing at the front lines (port 8080/8443) before any *request* can reach the core of the SIMAJU Core Node.js application (port 3000).

---

## 🚀 Security Architecture (Layered Defense)

This firewall utilizes a *Defense-in-Depth* concept. If an attacker bypasses the first layer, they still have to face the next layer before ultimately being blocked.

There are **5 Layers of Defense** in this Firewall:

### 1. Gate 1: Network Layer (`layers/network.rs`)
The outermost layer that inspects the caller's IP Address.
- **IP Blacklist:** Known malicious IPs (or manually blacklisted ones) will be outright rejected (`HTTP 403 Forbidden`).
- **IP Whitelist:** (Strict mode) Only registered IPs are allowed to pass.
- **Auto-Block:** If an IP is detected attacking multiple times, it will automatically be added to the Blacklist for a specified duration (e.g., 60 minutes).

### 2. Gate 2: Request Inspector (`layers/inspector.rs`)
The layer that checks data transmission patterns (*Rate Limiting* & *Size Check*).
- **Token Bucket Rate Limiter:** An efficient algorithm to prevent *DDoS* and *Spam* attacks. If an IP fires hundreds of requests in a second, it will be blocked (`HTTP 429 Too Many Requests`). This limit can be configured globally or per specific route (e.g., `/api/v1/auth` is stricter).
- **Body Size Limit:** Rejects massive payloads that could cause Node.js memory leaks or *Crash* (OOM).

### 3. Gate 3: WAF Payload Analyzer (`layers/analyzer.rs`)
The smart layer (WAF) that unpacks every URL and Request Body to look for malicious patterns (*Malicious Payload*).
- **Anti SQL Injection:** Blocks `OR 1=1`, `UNION SELECT`, `DROP TABLE` patterns, and `--` comment injections.
- **Anti XSS (Cross-Site Scripting):** Blocks malicious `<script>` tags, `onerror=`, or dangerous javascript schemas.
- **Anti Path Traversal:** Blocks attempts to read secret server files (e.g., `../../../../etc/passwd`).
- **Anti Command Injection:** Blocks OS command injections (e.g., `; rm -rf /` or `wget ...`).

### 4. Gate 4: Auth Protection (`layers/auth.rs`)
A specialized guard to protect the Login gate from *Brute Force* attacks (blind password guessing).
- If an IP fails to log in (receives a 401 response from Node.js) 5 consecutive times, that IP will automatically be **Locked Out** from the login page for 15 minutes. Their subsequent login requests will not be forwarded to Node.js.

### 5. Gate 5: Admin API & Metrics (`admin/handlers.rs`)
A dedicated admin channel to silently monitor activity. Runs on a secret port (default 9000).
- **Prometheus Metrics (`/metrics`):** Provides metrics for Grafana (total traffic, total blocked requests, etc.).
- **Manual Override API:** You can remotely add an IP to the blocklist (`POST /admin/block-ip`) or unblock it (`POST /admin/unblock-ip`) using the Admin Key.

---

## 🛠️ CLI Usage Guide

This Rust Firewall is seamlessly integrated into the `mji` command. You do not need to struggle to start it manually.

```bash
# RECOMMENDED: Start SIMAJU Core & Firewall Guard simultaneously
./mji up

# Start Node.js Framework only (If designing code)
./mji dev

# Start Rust Firewall only (for debugging)
./mji guard
```

---

## ⚙️ Configuration (guard.toml)

All Firewall security rules are dynamically controlled via the `guard/guard.toml` file. You can change these rules without having to *recompile* the Rust code.

Example configuration snippet:
```toml
[server]
port      = 8080
admin_port = 9000
admin_key  = "YOUR_SECRET_KEY"

[rate_limit]
enabled             = true
requests_per_window = 100
window_seconds      = 60

[brute_force]
enabled          = true
max_failed       = 5
lockout_minutes  = 15
login_route      = "/api/v1/auth/login"

[payload]
detect_sqli               = true
detect_xss                = true
detect_traversal          = true
detect_command_injection  = true
```

---

## 🚀 Deployment (Production)

SIMAJU Guard is designed to be ultra-lightweight:
- **Binary Size:** < 15 MB
- **RAM Usage:** ~10 MB under load
- **Latency:** < 1ms overhead

For *Production* environments, please use `guard/Dockerfile` to build a super small Alpine Linux *image*, or run it using the provided daemon: `guard/simaju-guard.service` (Linux Systemd).

*Your application is now as secure as an elite corporate fortress!* 🛡️
