'use strict';

const DB = require('../../database');

class AnalyticsService {
  async getSalesStats(startDate, endDate) {
    return DB.table('sales')
      .where('created_at', '>=', startDate)
      .where('created_at', '<=', endDate)
      .select('SUM(final_amount) as total_revenue', 'COUNT(*) as total_orders')
      .get();
  }

  async getTopProducts(limit = 5) {
    return DB.table('sale_details')
      .join('products', 'sale_details.product_id', '=', 'products.id')
      .select('products.name', 'SUM(sale_details.quantity) as total_sold')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .get();
  }
}

module.exports = new AnalyticsService();
