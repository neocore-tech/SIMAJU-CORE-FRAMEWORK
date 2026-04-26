'use strict';

const express = require('express');
const router = express.Router();

/**
 * Global Router
 * ─────────────────────────────────────────────────────────────
 * Mendaftarkan semua module routes di sini.
 */

// Import Routes
const authRoutes = require('../modules/auth/auth.route');
const userRoutes = require('../modules/user/user.route');
const categoryRoutes = require('../modules/category/category.route');
const productRoutes = require('../modules/product/product.route');
const supplierRoutes = require('../modules/supplier/supplier.route');
const saleRoutes = require('../modules/sale/sale.route');
// const purchaseRoutes = require('../modules/purchase/purchase.route');
const configRoutes = require('../modules/config/config.route');
const commRoutes = require('../modules/communication/communication.route');

// Register Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/sales', saleRoutes);
// router.use('/purchases', purchaseRoutes);
router.use('/config', configRoutes);
router.use('/communication', commRoutes);
router.use('/crm', require('../modules/crm/crm.route'));
router.use('/lms', require('../modules/lms/lms.route'));

module.exports = router;
