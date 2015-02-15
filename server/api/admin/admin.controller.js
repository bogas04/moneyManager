'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var async = require('async');
var Admin = require('./admin.model');
var Company = require('../company/company.model');

// TODO Improve response JSONs 
// TODO Add some API secret logic
// TODO Validations
// TODO API spec


// Get list of admins
// Super Admin Only
exports.index = function(req, res) {
  Admin.find({}, '-salt -hashedPassword', function(err, admins) { 
    if(err) { return res.send(500, err) }
    res.json(200, admins);
  });
};

// Get a single admin
exports.show = function(req, res, next) {
  var userId = req.params.id;

  Admin.findById(userId, function(err, admin) {
    if(err) return next(err);
    if(!user) return res.send(401);
    res.json(admin.profile);
  });
};

// Get self 
exports.me = function(req, res, next) {
  var userId = req.admin._id;
  Admin.findOne({_id : userId}, '-salt -hashedPassword').populate('companies').exec( function(err, admin) {
    if(err) return next(err);
    if(!admin) res.json(401);
    if(admin.isSuper) {
      Company.find({}, '-sal -hashedPassword', function(err, companies) {
        admin.companies = companies;
        res.json(admin);
      });
    } else res.json(admin);
  });
};

// Creates a new admin in the DB.
exports.create = function(req, res) {
  var newAdmin = new Admin(req.body);
  newAdmin.isSuper = false;
  newAdmin.save(function(err, admin) {
    if(err) return validationError(res, err);
    var token = jwt.sign(
      {_id : admin._id},
      config.secrets.session,
      {expiresInMinutes: 60*5});
    res.json({token:token});
  });
};

// Updates an existing admin in the DB.
exports.update = function(req, res) {
  var updatedAdmin = req.body;
  Admin.findById(req.admin._id, function (err, admin) {
    if(err) return validationError(res, err);
    if(!admin) res.json(401);
    admin.name = updatedAdmin.name || admin.name;
    admin.email = updatedAdmin.email || admin.email;
    admin.phone = updatedAdmin.phone || admin.phone;
    admin.save(function(err) {
      if(err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Deletes a admin from the DB.
// Super Admin Only
exports.destroy = function(req, res) {
  Admin.findByIdAndRemove(req.params.id, function(err, admin) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

exports.create_company = function (req, res) {
  var toCreate = req.body;
  if(!toCreate || !toCreate.username || !toCreate.password || !toCreate.owner || !toCreate.owner.email) {
    return res.json(403, { error : true, msg : "Company's username/owner's email id or password is missing"});
  }
  var admin = req.admin;
  Company.create(toCreate, function(err, company) {
    if(err) { return handleError(res, err); }
    if(!admin.isSuper) { 
      admin.companies.push(company._id);
      admin.save();
    }
    return res.json(201, {error : false, msg : "Company added", obj : company.profile}); 
  });
};

// Helper functions 
function handleError(res, err) {
  return res.send(500, err);
}
function readyObject(obj, filters) {
  if(!filters) {
    var filters = ['__v', 'hashed_password'];
  }
  console.log(filters);
  if(obj instanceof Array) {
    for(var o in obj) {
      obj[o] = readyObject(obj[o], filters);     
    }  
  } else {
    obj = obj.toJSON();
    for(var f in filters) {
      if(filters[f] in obj) { delete obj[filters[f]]; }
    }
  }
  return obj;
}

var validationError = function(res, err) {
  return res.json(422, err);
};
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
