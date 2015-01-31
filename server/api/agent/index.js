'use strict';

var express = require('express');
var controller = require('./agent.controller');

var router = express.Router();

router.get('/:company/:email', controller.show);
router.put('/:company/:email', controller.update);

router.post('/:company/:email/customer', controller.create_customer);
router.put('/:company/:email/customer', controller.update_customer);
router.get('/:company/:email/customer', controller.retrieve_customer);
router.delete('/:company/:email/customer', controller.destroy_customer);

module.exports = router;
