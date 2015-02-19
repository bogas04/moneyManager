'use strict';

var express = require('express');
var controller = require('./company.controller');
var config = require('../../config/environment');
var auth = require('../../auth-company/auth.service');

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:username', auth.isAuthenticated(), controller.update);

router.get('/agents', auth.isAuthenticated(), controller.retrieve_agents);
router.get('/agents/:id', auth.isAuthenticated(), controller.retrieve_agent);
router.post('/agents', auth.isAuthenticated(), controller.create_agent);
//router.put('/agents/:id', auth.isAuthenticated(), controller.update_agent);
router.delete('/agents/:id', auth.isAuthenticated(), controller.destroy_agent);

router.get('/customers', auth.isAuthenticated(), controller.retrieve_customers);
router.get('/customers/:id', auth.isAuthenticated(), controller.retrieve_customer);
router.put('/customers/:id', auth.isAuthenticated(), controller.update_customer);
router.post('/customers', auth.isAuthenticated(), controller.create_customer);
router.delete('/customers/:id', auth.isAuthenticated(), controller.destroy_customer);

module.exports = router;
