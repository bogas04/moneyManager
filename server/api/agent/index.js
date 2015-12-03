'use strict';

var express = require('express');
var controller = require('./agent.controller');
var config = require('../../config/environment');
var auth = require('../../auth-agent/auth.service');

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:emailid', auth.isAuthenticated(), controller.update);

router.get('/customers', auth.isAuthenticated(), controller.retrieve_customers);
router.get('/customers/:id', auth.isAuthenticated(), controller.retrieve_customer);
router.put('/customers/:id', auth.isAuthenticated(), controller.update_customer);
router.post('/customers', auth.isAuthenticated(), controller.create_customer);
router.delete('/customers/:id', auth.isAuthenticated(), controller.destroy_customer);

router.get('/committees', auth.isAuthenticated(), controller.retrieve_committees);
router.get('/committees/:id', auth.isAuthenticated(), controller.retrieve_committee);
router.put('/committees/:id', auth.isAuthenticated(), controller.update_committee);
router.post('/committees', auth.isAuthenticated(), controller.create_committee);
router.delete('/committees/:id', auth.isAuthenticated(), controller.destroy_committee);

module.exports = router;
