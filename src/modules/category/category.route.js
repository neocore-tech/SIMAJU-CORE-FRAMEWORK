'use strict';

const express = require('express');
const router = express.Router();
const CategoryController = require('./category.controller');
const CategoryValidation = require('./category.validation');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/', CategoryController.index);
router.post('/', CategoryValidation.create, CategoryController.store);

module.exports = router;
