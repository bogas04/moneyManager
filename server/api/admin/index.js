'use strict';

var express = require('express');
var controller = require('./admin.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Admin API 
router.post('/', controller.create);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id', auth.isAuthenticated(), controller.update);

router.post('/company', auth.isAuthenticated(), controller.create_company);

// Super Admin API
router.get('/', auth.isSuper(), controller.index);
router.get('/:id', auth.isSuper(), controller.show);
router.delete('/:id', auth.isSuper(), controller.destroy);


module.exports = router;
