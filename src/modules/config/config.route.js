'use strict';

const express = require('express');
const router = express.Router();
const ConfigService = require('./config.service');
const Response = require('../../utils/response');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/', async (req, res) => {
  const data = await ConfigService.getSettings();
  return Response.success(res, data);
});

router.post('/', async (req, res) => {
  const data = await ConfigService.updateSettings(req.body);
  return Response.success(res, data, 'Settings updated');
});

module.exports = router;
