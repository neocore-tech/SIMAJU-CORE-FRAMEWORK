# Simaju Core Framework Architecture

Simaju Core utilizes a **Modular Layered Architecture** inspired by Laravel but optimized for Node.js performance.

## 🏗️ Core Directory Structure

```text
/src
  /core              # Main engine (App, Router, Scheduler, Event Bus)
  /database          # Database Manager & Drivers (MySQL, PG, SQLite, Mongo)
  /modules           # Modular features (Auth, User, Product, etc.)
  /middlewares       # Request filters (Auth, Permission, Tenant, Log)
  /utils             # Standalone utilities (Logger, Response, Mail, AI)
  /config            # Global settings & env validators
```

## 🔄 Feature Workflow

Every feature inside `/src/modules` must follow this flow:

1.  **Route**: Defines the API endpoints.
2.  **Validation**: Ensures input matches the specification before reaching the logic.
3.  **Controller**: Handles HTTP requests and responses.
4.  **Service**: Where the core business logic resides.
5.  **Output**: Uniform responses via `src/utils/response.js`.

## 📦 Global Components

- **Event Bus**: Synchronization system between modules without tight coupling.
- **Scheduler**: Automated background task management.
- **Activity Log**: Automatic tracking of every data change.
