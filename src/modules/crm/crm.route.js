'use strict';

const express = require('express');
const router = express.Router();
const CrmController = require('./crm.controller');
const auth = require('../../middlewares/auth.middleware');

/**
 * CRM Module Routes
 * ─────────────────────────────────────────────────────────────
 */

// All CRM routes protected by Auth
router.use(auth);

// Customers
router.get('/customers',      CrmController.listCustomers);
router.get('/customers/:id',  CrmController.customerDetail);
router.post('/customers',     CrmController.createCustomer);

// Leads
router.get('/leads',          CrmController.listLeads);
router.post('/leads/:id/convert', CrmController.convertLead);

// Tickets
router.post('/tickets',       CrmController.createTicket);

module.exports = router;
