'use strict';

/**
 * Migration: Create CRM Tables
 */
module.exports = {
  up: async (db) => {
    const conn = await db._resolveConnection(db.defaultConnection);
    const driver = conn.driver;
    const pk = driver === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const dt = driver === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

    // 1. CRM Customers
    await db.raw(`
      CREATE TABLE IF NOT EXISTS crm_customers (
        id ${pk},
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        type TEXT DEFAULT 'personal', -- personal, corporate
        status TEXT DEFAULT 'active', -- lead, active, suspended, churn
        custom_fields TEXT,           -- JSON string for GPS, package, etc
        created_at ${dt},
        updated_at ${dt}
      )
    `);

    // 2. CRM Leads (Sales Pipeline)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS crm_leads (
        id ${pk},
        customer_name TEXT NOT NULL,
        contact_info TEXT,
        source TEXT,                 -- ads, referral, social
        stage TEXT DEFAULT 'new',    -- new, contacted, survey, offer, won, lost
        score INTEGER DEFAULT 0,
        assigned_to INTEGER,         -- user_id
        value DECIMAL(15, 2),
        created_at ${dt},
        updated_at ${dt}
      )
    `);

    // 3. CRM Tickets (Helpdesk)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS crm_tickets (
        id ${pk},
        ticket_no TEXT UNIQUE,
        customer_id INTEGER,
        subject TEXT NOT NULL,
        category TEXT,               -- technical, billing, info
        priority TEXT DEFAULT 'medium', -- low, medium, high, critical
        status TEXT DEFAULT 'open',  -- open, pending, resolved, closed
        assigned_to INTEGER,         -- user_id
        created_at ${dt},
        updated_at ${dt}
      )
    `);

    // 4. CRM Activities (Interaction Log)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS crm_activities (
        id ${pk},
        customer_id INTEGER,
        lead_id INTEGER,
        type TEXT,                   -- call, email, meeting, note
        content TEXT,
        is_private BOOLEAN DEFAULT false,
        created_by INTEGER,          -- user_id
        created_at ${dt}
      )
    `);
  },

  down: async (db) => {
    await db.raw('DROP TABLE IF EXISTS crm_activities');
    await db.raw('DROP TABLE IF EXISTS crm_tickets');
    await db.raw('DROP TABLE IF EXISTS crm_leads');
    await db.raw('DROP TABLE IF EXISTS crm_customers');
  }
};
