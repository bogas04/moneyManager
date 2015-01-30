'use strict';

var express = require('express');
var controller = require('./admin.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:email', controller.show);
router.post('/', controller.create);
router.put('/', controller.update);
router.patch('/', controller.update);
router.delete('/', controller.destroy);

module.exports = router;
