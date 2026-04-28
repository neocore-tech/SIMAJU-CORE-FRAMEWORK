# 📦 Module Development Guide

Within the **SIMAJU Core Framework** architecture, a **Module** is the largest unit of functionality. A module contains complete business logic (such as LMS, CRM, Billing) that runs inside the *core engine*.

Unlike a *Plugin* which usually only attaches/injects small functions, a *Module* has its own *Router*, *Controller*, *Service*, and *Database Migration*.

---

## 1. Module Directory Structure

Every module must be placed inside the `src/modules/<module_name>` folder. Here is the standard structure:

```text
src/modules/inventory/
├── index.js                  # Module entry point (route registration)
├── inventory.controller.js   # Handles HTTP requests & responses
├── inventory.service.js      # Handles business logic & database queries
├── inventory.route.js        # Defines API endpoints (Router)
└── /tests/                   # (Optional) Specific unit tests for this module
```

---

## 2. How to Create a New Module

You don't need to create files manually. SIMAJU Core comes with an automated CLI tool (Scaffolding) using the `mji` command.

### Step 1: Generate Skeleton
Use the following CLI command in your terminal:
```bash
mji make:module inventory
```
This command will automatically create the `src/modules/inventory` folder along with the entire skeleton of `.controller.js`, `.service.js`, and `.route.js` files that are already interconnected.

### Step 2: Module Registration (Automatic)
If you use the `mji make:module` command, the module will be automatically detected by the *auto-loader* in `src/core/app.js`.

However, if it is not detected, make sure the `index.js` structure in your module returns the routes correctly:

```javascript
// src/modules/inventory/index.js
const inventoryRoute = require('./inventory.route');

module.exports = {
  routes: inventoryRoute
};
```

---

## 3. MVC Workflow (Model-Service-Controller)

To keep the code clean (*Clean Architecture*), SIMAJU Core separates logic into 3 main layers:

### A. Route Layer (`.route.js`)
Only responsible for registering URLs and security *middleware* (example: JWT authentication).
```javascript
const router = require('express').Router();
const controller = require('./inventory.controller');
const authMiddleware = require('../../core/middleware/auth.middleware');

router.get('/', authMiddleware, controller.getAllItems);
router.post('/', authMiddleware, controller.createItem);

module.exports = router;
```

### B. Controller Layer (`.controller.js`)
Only responsible for handling Requests (`req`) and Responses (`res`). **Do not** write *database queries* or complex business logic here.
```javascript
const service = require('./inventory.service');

const getAllItems = async (req, res, next) => {
  try {
    const data = await service.fetchAllItems();
    res.json({ success: true, data });
  } catch (error) {
    next(error); // Throw to Core Error Handler
  }
};

module.exports = { getAllItems };
```

### C. Service Layer (`.service.js`)
This is where all business logic and interaction with the *Database Query Builder* are placed.
```javascript
const db = require('../../core/database');

const fetchAllItems = async () => {
  // Example using Knex Query Builder or Sequelize
  return await db('inventory_items').select('*').where('is_active', true);
};

module.exports = { fetchAllItems };
```

---

## 4. Module Security

* **Use Auth Middleware:** Ensure every *endpoint* that modifies data (`POST`, `PUT`, `DELETE`) is protected by `authMiddleware`.
* **Use Validation:** Validate the body payload using Joi or Zod before processing the data in the Service.
* **Avoid Hardcoding:** Always use Environment Variables (`process.env.VARIABLE_NAME`) to store third-party *secrets* specific to your module.
