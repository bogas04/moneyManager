'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('company', function (err, company, info) {
    var error = err || info;
    if (error) {
      return res.json(401, error);
    }
    if (!company) return res.json(404, {message: 'Something went wrong, please try again.'});

    var token = auth.signToken(company._id, company.role);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;
