'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var Admin = require('../api/admin/admin.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the admin object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach admin to request
    .use(function(req, res, next) {
      //console.log(req.admin,req.user);
      Admin.findById(req.user._id, function (err, admin) {
        if (err) return next(err);
        if (!admin) return res.send(401);

        req.admin = admin;
        next();
      });
    });
}

/**
 * Checks if the admin role meets the minimum requirements of the route
 */
function isSuper() {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (req.admin.isSuper) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.admin) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.admin._id);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.isSuper = isSuper;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
