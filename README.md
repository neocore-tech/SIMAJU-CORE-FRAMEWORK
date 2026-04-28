# <p align="center">SIMAJU Core Framework</p>

<p align="center">
  <strong>SIMAJU Core Framework + SIMAJU Guard (Rust Firewall)</strong><br>
  <em>The Modern Modular Backend Framework — Built for SaaS, Enterprise & Developers</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/architecture-modular-success.svg" alt="Architecture">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node Support">
  <img src="https://img.shields.io/badge/rust-1.70+-orange.svg" alt="Rust Support">
  <img src="https://img.shields.io/badge/install-npx create--simaju--app-blueviolet.svg" alt="Install">
</p>

---

## 🚀 What is SIMAJU Core?

**SIMAJU Core** is a modern backend framework with an **Ultra-Lightweight Modular** architecture. The main framework is intentionally built to be extremely lightweight and contains only essential modules — all business features are installed separately through the module and plugin system.

Now equipped with **SIMAJU Guard**, a lightning-fast Reverse Proxy & Firewall based on **Rust** that protects your application from *DDoS*, *SQL Injection*, *XSS*, and *Brute Force* attacks, ensuring high performance and top-tier security.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🛡️ **SIMAJU Guard** | Built-in Rust Firewall: Rate Limiter, IP Blacklist, WAF, Brute Force Protection |
| 📦 **Modular System** | Install only the business modules you need — no bloatware |
| 🔌 **Dynamic Discovery** | Routers & Plugin Manager are 100% auto-detected |
| 🛠️ **CLI `mji`** | Artisan-like commands that are incredibly easy to use |
| 💾 **Multi-DB Support** | SQLite, MySQL, PostgreSQL, MongoDB — Database Agnostic |
| 🔐 **Auto Secret Keygen** | Unique JWT Key & Admin Key automatically generated per project |
| 🌐 **SEO Engine** | Dynamic Meta tags, Sitemap, Schema JSON-LD, and built-in 301 Redirects |

---

## ⚡ Automated Installation (Recommended)

> **Prerequisites:** Make sure you have installed [Node.js](https://nodejs.org/) version 18 or newer and [Git](https://git-scm.com/).

Just one command to get started. The following process will run **completely automatically**:

```bash
npx create-simaju-app your-project-name
```

### What happens automatically under the hood:
1. ✅ Framework is cloned from GitHub to your project folder
2. ✅ Old git history is cleaned & a fresh git repository is initialized for your project
3. ✅ You will be prompted to select your preferred database (SQLite / MySQL / PostgreSQL)
4. ✅ `.env` file is created from the template with **truly random & unique JWT Secret & Admin Keys**
5. ✅ All NPM dependencies are installed immediately

### Continue after installation:

```bash
# Go into your project folder
cd your-project-name

# Run the framework + firewall simultaneously
./mji up
```

> 💡 If you chose **SQLite**, everything is ready to go! If you chose **MySQL/PostgreSQL**, fill in your database credentials in the `.env` file first, then run `./mji migrate`.

---

## 💻 How to Run

SIMAJU Core provides the `mji` command as the central control for all your framework operations.

### Main Modes

```bash
# 🚀 HIGHLY RECOMMENDED: Run Framework + Firewall simultaneously
./mji up

# 💻 Development Mode (Node.js Framework only)
./mji dev

# 🛡️ Firewall only (for microservices architecture)
./mji guard
```

### Database

```bash
./mji migrate      # Run all pending migrations
./mji seed         # Populate database with initial data (seeders)
./mji rollback     # Undo the last migration batch
```

### Scaffolding (Auto Code Generation)

```bash
./mji make:module inventory       # Create a new business module
./mji make:migration create_users # Create a new migration file
```

### Monitoring & Testing

```bash
./mji monit   # Open Interactive Terminal Dashboard (CPU, RAM, Network)
./mji test    # Run unit testing & API testing
./mji help    # Display all available commands
```

---

## 📁 Core Directory Structure

```text
your-project-name/
├── src/
│   ├── core/        # Framework engine (Router, Auth, DB, etc)
│   ├── modules/     # Your business modules (Inventory, CRM, etc)
│   ├── plugins/     # Additional plugins (Email, Payment Gateway, etc)
│   └── seo/         # SEO Engine (Meta, Sitemap, Schema)
├── guard/           # SIMAJU Guard Firewall (Rust)
│   └── guard.toml   # Firewall & WAF configuration
├── resources/
│   └── views/       # Theme Templates & Views (EJS)
├── public/          # Static assets (CSS, JS, Images)
├── tests/           # Unit & API testing scripts
├── .env             # Environment configuration (auto-generated)
├── simaju.json      # List of active modules, plugins, and themes
└── mji              # SIMAJU main CLI tool
```

---

## 🛡️ SIMAJU Guard — Rust-Based Firewall

This framework is protected by **SIMAJU Guard**, a high-performance *reverse proxy* built with Rust.

| Protection | Detail |
|---|---|
| **WAF** | Detects & blocks SQLi, XSS, Path Traversal, Command Injection |
| **Rate Limiter** | Token Bucket per IP, configurable per-route |
| **Brute Force Lock** | Auto-block IPs after a number of failed login attempts |
| **IP Blacklist** | Dynamically blocks attacking IPs |
| **Security Headers** | HSTS, X-Frame-Options, CSP, etc. — automatically injected |
| **TLS/HTTPS** | Native SSL/TLS certificate support via `rustls` |
| **Admin API** | Remote firewall control via REST API (port 9000) |

Full firewall configuration can be found in `guard/guard.toml`.

---

## 🌐 SIMAJU Ecosystem

SIMAJU Core is designed to be extensible. Discover the official collection of ready-to-use modules, plugins, and themes in the following repositories:

| Repository | Contents | Link |
|---|---|---|
| **koleksi-modul-simaju** | Official business modules collection (CRM, LMS, Inventory, HRIS, etc) | [→ neocore-tech/koleksi-modul-simaju](https://github.com/neocore-tech/koleksi-modul-simaju) |
| **simaju-modul-templat** | Official scaffold template for building new modules | [→ neocore-tech/simaju-modul-templat](https://github.com/neocore-tech/simaju-modul-templat) |
| **plugin-simaju** | Third-party integration plugins (Email, Payment, Analytics, etc) | [→ neocore-tech/plugin-simaju](https://github.com/neocore-tech/plugin-simaju) |
| **template-plugin-simaju** | Official scaffold template for building new plugins | [→ neocore-tech/template-plugin-simaju](https://github.com/neocore-tech/template-plugin-simaju) |
| **template-tema-simaju** | Official UI themes & template collection (EJS) | [→ neocore-tech/template-tema-simaju](https://github.com/neocore-tech/template-tema-simaju) |

> 💡 To install a module/plugin/theme, simply register its name in the `simaju.json` file and run `./mji install:all`.

---

## 📚 Documentation

Comprehensive technical documentation is available in the `Dokumentasi/` folder:

| File | Content |
|---|---|
| `guide_module_development.md` | How to create a new business Module (MVC) |
| `guide_plugin_development.md` | How to create a Plugin & hook into the Event Bus |
| `guide_theme_development.md` | How to create & activate a Theme (SSR) |
| `seo.md` | Complete SEO Engine Guide (8 Phases) |
| `firewall_guard.md` | SIMAJU Guard Documentation |
| `architecture.md` | Folder architecture & core workflow |

---

<p align="center">Built with ❤️ by <b>SIMAJU Core Team</b></p>
