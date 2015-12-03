'use strict';
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
=====================
   Required Models   
=====================
*/
var Company = require('../company/company.model');
var Agent = require('../agent/agent.model');
var Customer = require('../customer/customer.model');
var Committee = require('../committee/committee.model');

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
  Agent.find({company : req.company._id} , function(err, agents) {
    if(err) { return handleError(res, err); }
    if(!agents) { return res.json(404, { error : true, msg : "Agents not found", data : []}); }
    res.json(200, agents);
  });
};

// Get a single agent
exports.retrieve_agent = function(req, res) {
  var agentId = req.params.id;
  Agent.findOne({_id : agentId, company : req.company._id}, function(err, agent) {
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
    return res.json(201, {error : false, msg : "Agent added", data : agent.profile}); 
  });
};

// Delete a agent 
exports.destroy_agent = function(req, res) {
  Agent.findOneAndRemove(req.params.id, function (err) {
    if(err) return validationError(res, err);
    res.send(204);
  });
};

/*
============================
  Customer related queries  
============================
*/

// Get list of customers 
exports.retrieve_customers = function(req, res) {
  Customer.find({company : req.company._id}, function(err, customers) {
    if(err) { return handleError(res, err); }
    if(!customers) { return res.json(404, { error : true, msg : "Customers not found", data : []}); }
    res.json(200, customers);
  });
};

// Retrieve a single customer 
exports.retrieve_customer = function(req, res) {
  var customerId = req.params.id;
  Customer.findOne({_id : customerId, company : req.company._id}, function(err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { res.json(customer); }
    else res.json(200, customer);
  });
};

// Update a customer 
exports.update_customer = function(req, res) {
  var updatedCustomer = req.body;
  Customer.findById(req.params.id, function (err, customer) {
    if(err) return validationError(res, err);
    if(!customer) res.json(401);
    customer.name = updatedCustomer.name || customer.name || "";
    customer.email = updatedCustomer.email || customer.email || "";
    customer.phone = updatedCustomer.phone || customer.phone;
    customer.terms = updatedCustomer.terms || customer.terms || [];
    customer.address = updatedCustomer.address || customer.address;
    customer.visible_to = updatedCustomer.visible_to || customer.visible_to;
    customer.committees = updatedCustomer.committees || customer.committees;
    customer.comments = updatedCustomer.comments || customer.comments;
    customer.save(function(err) {
      if(err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Delete a customer 
exports.destroy_customer = function(req, res) {
  Customer.findOneAndRemove(req.params.id, function (err) {
    if(err) return validationError(res, err);
    res.send(204, {error : false, msg : "Deleted successfully! ", data : null});
  });
};

// Create customer 
exports.create_customer = function(req, res) {
  var toCreate = req.body;
  if(!toCreate || !toCreate.phone) {
    return res.json(403, { error : true, msg : "Customer's phone is missing"});
  }
  var company = req.company;
  toCreate.company = company._id;
  Customer.create(toCreate, function(err, customer) {
    if(err) { return handleError(res, err); }
    return res.json(201, {error : false, msg : "Customer added", obj : customer.profile}); 
  });
};

/*
============================
  Committee related queries  
============================
*/

// Get list of committees 
exports.retrieve_committees = function(req, res) {
  Committee.find({company : req.company._id}, function(err, committees) {
    if(err) { return handleError(res, err); }
    if(!committees) { return res.json(404, { error : true, msg : "Committees not found", data : []}); }
    res.json(200, committees);
  });
};

// Retrieve a single committee 
exports.retrieve_committee = function(req, res) {
  var committeeId = req.params.id;
  Committee.findOne({_id : committeeId, company : req.company._id}).populate('members.list.details').exec(function(err, committee) {
    if(err) { return handleError(res, err); }
    if(!committee) { res.json(committee); }
    else res.json(200, committee);
  });
};

// Update a committee 
exports.update_committee = function(req, res) {
  var updatedCommittee = req.body;
  Committee.findById(req.params.id, function (err, committee) {
    if(err) return validationError(res, err);
    if(!committee) res.json(401);
    committee.title = updatedCommittee.title || committee.title || "";
    committee.duration = updatedCommittee.duration || committee.duration;
    committee.members = updatedCommittee.members || committee.members || [];
    committee.visible_to = updatedCommittee.visible_to || committee.visible_to || [];
    committee.logs = updatedCommittee.logs || committee.logs || [];
    committee.save(function(err) {
      if(err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Delete a committee 
exports.destroy_committee = function(req, res) {
  Committee.findOneAndRemove(req.params.id, function (err) {
    if(err) return validationError(res, err);
    res.send(204, {error : false, msg : "Deleted successfully! ", data : null});
  });
};

// Create committee 
exports.create_committee = function(req, res) {
  var toCreate = req.body;
  if(!toCreate || !toCreate.title) {
    return res.json(403, { error : true, msg : "Committee's title is missing"});
  }
  var company = req.company;
  toCreate.company = company._id;
  Committee.create(toCreate, function(err, committee) {
    console.log(err);
    if(err) { return handleError(res, err); }
    return res.json(201, {error : false, msg : "Committee added", obj : committee.profile}); 
  });
};

exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

