'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, admin, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!admin) return res.json(404, {message: 'Something went wrong, please try again.'});

    var token = auth.signToken(admin._id, admin.role);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;
