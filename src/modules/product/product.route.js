'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('./product.controller');
const ProductValidation = require('./product.validation');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/', ProductController.index);
router.post('/', ProductValidation.create, ProductController.store);

module.exports = router;
