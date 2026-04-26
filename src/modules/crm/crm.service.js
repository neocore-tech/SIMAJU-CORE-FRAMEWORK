'use strict';

const { Customer, Lead, Ticket, Activity } = require('./crm.model');
const DB = require('../../database');

/**
 * CRM Service
 */
class CrmService {
  // ── Customer Management ─────────────────────────────────────
  async getAllCustomers() {
    return Customer.all();
  }

  async getCustomerDetail(id) {
    const customer = await Customer.find(id);
    if (!customer) throw new Error('Customer not found');

    // Attach related data
    const tickets = await DB.table('crm_tickets').where('customer_id', id).get();
    const activities = await DB.table('crm_activities').where('customer_id', id).orderBy('created_at', 'DESC').get();
    
    return { ...customer.toJSON(), tickets, activities };
  }

  async createCustomer(data) {
    return Customer.create(data);
  }

  // ── Lead Management ─────────────────────────────────────────
  async getLeads() {
    return Lead.all();
  }

  async convertLeadToCustomer(leadId) {
    const lead = await Lead.find(leadId);
    if (!lead) throw new Error('Lead not found');

    const customer = await Customer.create({
      name: lead.customer_name,
      status: 'active',
      type: 'personal'
    });

    await lead.save({ stage: 'won' });
    return customer;
  }

  // ── Ticket Management ───────────────────────────────────────
  async createTicket(data) {
    const ticket_no = 'TIC-' + Date.now();
    return Ticket.create({ ...data, ticket_no });
  }

  async getTicketsByStatus(status) {
    return DB.table('crm_tickets').where('status', status).get();
  }

  // ── Activity Management ─────────────────────────────────────
  async logActivity(data) {
    return Activity.create(data);
  }
}

module.exports = new CrmService();
