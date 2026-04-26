'use strict';

const Model = require('../../database/model');

class Customer extends Model {
  static table = 'crm_customers';
}

class Lead extends Model {
  static table = 'crm_leads';
}

class Ticket extends Model {
  static table = 'crm_tickets';
}

class Activity extends Model {
  static table = 'crm_activities';
}

module.exports = { Customer, Lead, Ticket, Activity };
