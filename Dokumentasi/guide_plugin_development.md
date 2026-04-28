# 🔌 Plugin Development Guide

In the **SIMAJU Core Framework**, a **Plugin** is a small-sized feature or third-party integration that injects additional *behavior* without modifying the existing core code (*Core*) or modules (*Modules*).

Plugins work reactively by listening to (declaring) _Events_ through the **Event Bus** system.

---

## 1. Basic Plugin Concept

Plugins in SIMAJU Core are designed very similarly to the WordPress plugin architecture, where plugins respond to "Hooks" or "Events".

Examples of Plugin usage:
*   **Email Notifier** Plugin: Automatically sends a welcome email when a `user.registered` event occurs.
*   **SEO Auto-Ping** Plugin: Notifies Google Indexer when an `article.published` event occurs.
*   **Stripe Payment** Plugin: Adds a third-party payment method without cluttering the core `payment-system`.

---

## 2. Plugin Directory Structure

Every plugin must be placed inside the `src/plugins/<plugin_name>` folder.

```text
src/plugins/email-notifier/
├── index.js                  # Entry point (required)
├── config.json               # Default plugin configuration (optional)
└── services/                 # Supporting logic folder (optional)
```

---

## 3. How to Create a Plugin

### Step 1: Register Metadata
A plugin must export an object defining its identity and an `init` function that will be executed by the *Core Engine* during booting.

```javascript
// src/plugins/email-notifier/index.js

module.exports = {
  // Plugin Metadata
  name: 'Email Notifier',
  version: '1.0.0',
  description: 'Sends a welcome email to new users',
  
  // Initialization Function called by the Core during Boot
  init: (app, eventBus) => {
    console.log('[Plugin] Email Notifier initialized.');

    // Registering an Event Listener (Hooking)
    eventBus.on('user.registered', async (userData) => {
        try {
            await sendWelcomeEmail(userData.email, userData.name);
            console.log(`[Plugin] Email successfully sent to ${userData.email}`);
        } catch (error) {
            console.error('[Plugin] Failed to send email:', error);
        }
    });
  }
};

async function sendWelcomeEmail(email, name) {
    // Logic to send email via SMTP/Nodemailer
}
```

### Step 2: Activating the Plugin
For your plugin to be executed by the system, you must add it to the `plugins` list in the `simaju.json` file located in the *project root*.

```json
{
  "name": "simaju-app",
  "version": "1.0.0",
  "plugins": [
    "email-notifier"
  ]
}
```

---

## 4. Advantages of Using Plugins

1. **Isolated (Sandboxed):** A plugin that encounters an *error* usually will not crash the entire framework; it will only be isolated within its own *event listener*.
2. **Easily Detachable (Pluggable):** If a company no longer needs the "Email Notifier" integration, simply remove its name from `simaju.json`. You don't need to change a single line of code in `auth.controller.js`!
3. **Reusable:** Plugins can be distributed in `.zip` or NPM formats and reused by other client companies that also use SIMAJU Core.
