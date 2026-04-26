'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * Web Router
 * ─────────────────────────────────────────────────────────────
 */

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/index.html');
  
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  res.status(404).send('Welcome page not found.');
});

router.get('/docs', (req, res) => {
  res.redirect('/docs/intro');
});

router.get('/docs/intro', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/intro.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Intro page not found.');
});

router.get('/docs/basics', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/basics.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Basics page not found.');
});

router.get('/docs/security', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/security.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Security page not found.');
});

router.get('/docs/database', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/database.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Database page not found.');
});

router.get('/docs/architecture', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/architecture.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Architecture page not found.');
});

router.get('/docs/advanced', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/advanced.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Advanced page not found.');
});

router.get('/ecosystem', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/ecosystem.html');
  
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  res.status(404).send('Ecosystem page not found.');
});

router.get('/admin/plugins', (req, res) => {
  const filePath = path.join(__dirname, '../views/admin/plugins.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Admin Plugin page not found.');
});

router.get('/docs/plugins', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/plugins-directory.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Plugin Directory page not found.');
});

router.get('/docs/plugins-guide', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/plugin-guide.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Plugin Guide page not found.');
});

router.get('/docs/modules-guide', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/docs/module-guide.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Module Guide page not found.');
});

router.get('/modules', (req, res) => {
  const filePath = path.join(__dirname, '../views/welcome/modules.html');
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).send('Modules page not found.');
});

module.exports = router;
