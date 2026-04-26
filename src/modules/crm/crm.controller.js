'use strict';

const CrmService = require('./crm.service');

/**
 * CRM Controller
 */
class CrmController {
  async listCustomers(req, res) {
    try {
      const customers = await CrmService.getAllCustomers();
      res.json({ status: true, data: customers });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }

  async customerDetail(req, res) {
    try {
      const detail = await CrmService.getCustomerDetail(req.params.id);
      res.json({ status: true, data: detail });
    } catch (err) {
      res.status(404).json({ status: false, message: err.message });
    }
  }

  async createCustomer(req, res) {
    try {
      const customer = await CrmService.createCustomer(req.body);
      res.status(201).json({ status: true, data: customer });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  }

  async listLeads(req, res) {
    try {
      const leads = await CrmService.getLeads();
      res.json({ status: true, data: leads });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }

  async convertLead(req, res) {
    try {
      const customer = await CrmService.convertLeadToCustomer(req.params.id);
      res.json({ status: true, message: 'Lead converted successfully', data: customer });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  }

  async createTicket(req, res) {
    try {
      const ticket = await CrmService.createTicket(req.body);
      res.status(201).json({ status: true, data: ticket });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  }
}

module.exports = new CrmController();
