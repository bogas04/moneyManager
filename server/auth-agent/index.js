'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Admin = require('../api/admin/admin.model');

// Passport Configuration
require('./local/passport').setup(Admin, config);
require('./facebook/passport').setup(Admin, config);
require('./google/passport').setup(Admin, config);
require('./twitter/passport').setup(Admin, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;
