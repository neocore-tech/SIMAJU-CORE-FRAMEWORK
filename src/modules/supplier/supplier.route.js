'use strict';

const express = require('express');
const router = express.Router();
const SupplierController = require('./supplier.controller');
const SupplierValidation = require('./supplier.validation');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/', SupplierController.index);
router.post('/', SupplierValidation.create, SupplierController.store);

module.exports = router;
