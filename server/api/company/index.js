'use strict';

var express = require('express');
var controller = require('./company.controller');

var router = express.Router();

router.get('/:username/agents', controller.retrieve_agents);
router.post('/:username/agents', controller.create_agents);
router.get('/:username', controller.show);
router.put('/:username', controller.update);

module.exports = router;
