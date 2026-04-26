'use strict';

const express = require('express');
const router = express.Router();
const WarehouseController = require('./warehouse.controller');

router.get('/', WarehouseController.index);
router.post('/', WarehouseController.store);

module.exports = router;