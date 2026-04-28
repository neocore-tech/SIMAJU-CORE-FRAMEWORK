'use strict';

const express  = require('express');
const router   = express.Router();
const PurchaseController = require('./purchase.controller');
const auth     = require('../../middlewares/auth.middleware');

router.get   ('/',    auth, PurchaseController.index);
router.post  ('/',    auth, PurchaseController.store);
router.get   ('/:id', auth, PurchaseController.show);
router.put   ('/:id', auth, PurchaseController.update);
router.delete('/:id', auth, PurchaseController.destroy);

module.exports = router;
