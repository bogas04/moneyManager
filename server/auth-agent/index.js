'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Agent = require('../api/agent/agent.model');

// Passport Configuration
require('./local/passport').setup(Agent, config);
require('./facebook/passport').setup(Agent, config);
require('./google/passport').setup(Agent, config);
require('./twitter/passport').setup(Agent, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;
