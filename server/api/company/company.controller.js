'use strict';
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var async = require('async');
var Company = require('../company/company.model');
var Agent = require('../agent/agent.model');
var Customer = require('../customer/customer.model');

/*
====================
  Helper Functions  
====================
*/

var validationError = function(res, err) {
  return res.json(422, err);
};
function handleError(res, err) {
  return res.send(500, err);
}
/*
===========================
  Company related queries  
===========================
*/

// Get self 
exports.me = function(req, res, next) {
  var userId = req.company._id;
  Company.findOne({_id : userId}, '-salt -hashedPassword', function(err, company) {
    if(err) return next(err);
    if(!company) res.json(401);
    else res.json(company);
  });
};

// Updates an existing company in the DB.
exports.update = function(req, res) {
  var updatedCompany = req.body;
  Company.findById(req.company._id, function (err, company) {
    if(err) return validationError(res, err);
    if(!company) res.json(401);
    company.name = updatedCompany.name || company.name;
    company.username = updatedCompany.username || company.username;
    company.subscription = updatedCompany.subscription || company.subscription;
    if(updatedCompany.owner) {
      company.owner.email = updatedCompany.owner.email || company.owner.email;
      company.owner.name = updatedCompany.owner.name || company.owner.name;
    }
    company.save(function(err) {
      if(err) return validationError(res, err);
      res.send(200);
    });
  });
};

/*
=========================
  Agent related queries  
=========================
*/

// Get list of agents 
exports.retrieve_agents = function(req, res) {
  Agent.find({}, function(err, agents) {
    if(err) { return handleError(res, err); }
    if(!agents) { return res.json(404, { error : true, msg : "Agents not found", data : []}); }
    res.json(200, agents);
  });
};

exports.retrieve_agent = function(req, res) {
  var agentId = req.params.id;
  Agent.find({_id : agentId}, function(err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { res.json(agent); }
    else res.json(200, agent);
  });
};
// Create agent 
exports.create_agent = function(req, res) {
  var toCreate = req.body;
  if(!toCreate || !toCreate.email || !toCreate.password) {
    return res.json(403, { error : true, msg : "Agent's username/owner's email id or password is missing"});
  }
  var company = req.company;
  toCreate.company = company._id;
  Agent.create(toCreate, function(err, agent) {
    if(err) { return handleError(res, err); }
    return res.json(201, {error : false, msg : "Agent added", obj : agent.profile}); 
  });
};

/*
============================
  Customer related queries  
============================
*/

// Get list of agents 
exports.retrieve_customers = function(req, res) {
  Agent.find({}, function(err, agents) {
    if(err) { return handleError(res, err); }
    if(!agents) { return res.json(404, { error : true, msg : "Agents not found", data : []}); }
    res.json(200, agents);
  });
};

exports.retrieve_customer = function(req, res) {
  var agentId = req.params.id;
  Agent.find({_id : agentId}, function(err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { res.json(agent); }
    else res.json(200, agent);
  });
};

// Create customer 
exports.create_customer = function(req, res) {
  var toCreate = req.body;
  if(!toCreate || !toCreate.email || !toCreate.password) {
    return res.json(403, { error : true, msg : "Agent's username/owner's email id or password is missing"});
  }
  var company = req.company;
  toCreate.company = company._id;
  Agent.create(toCreate, function(err, agent) {
    if(err) { return handleError(res, err); }
    return res.json(201, {error : false, msg : "Agent added", obj : agent.profile}); 
  });
};

exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

