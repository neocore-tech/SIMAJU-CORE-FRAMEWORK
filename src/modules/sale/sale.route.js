'use strict';

const express = require('express');
const router = express.Router();
const SaleController = require('./sale.controller');
const SaleValidation = require('./sale.validation');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.post('/', SaleValidation.create, SaleController.store);

module.exports = router;
