'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var Agent = require('../api/agent/agent.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the agent object to the request if authenticated
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
    // Attach agent to request
    .use(function(req, res, next) {
      //console.log(req.agent,req.user);
      Agent.findById(req.user._id, function (err, agent) {
        if (err) return next(err);
        if (!agent) return res.send(401);

        req.agent = agent;
        next();
      });
    });
}

/**
 * Checks if the agent role meets the minimum requirements of the route
 */
function isSuper() {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (req.agent.isSuper) {
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
  if (!req.agent) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.agent._id);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.isSuper = isSuper;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
