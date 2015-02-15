'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Company = require('../api/company/company.model');

// Passport Configuration
require('./local/passport').setup(Company, config);
require('./facebook/passport').setup(Company, config);
require('./google/passport').setup(Company, config);
require('./twitter/passport').setup(Company, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;
