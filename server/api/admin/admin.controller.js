'use strict';

var _ = require('lodash');
var async = require('async');
var Admin = require('./admin.model');
var Company = require('../company/company.model');
var bcrypt = require('bcrypt');
var saltSize = 10;

// TODO Improve response JSONs 
// TODO Add some API secret logic
// TODO Validations
// TODO API spec


// Get list of admins
exports.index = function(req, res) {
  if(!req.query.email || !req.query.password) {
    return res.json(403, {error : true, msg : "Email and password are required fields"});
  }
  Admin.findOne({ email : req.query.email }, function(err, admin) {
    if(!admin) { return res.send(404); }
    if(admin.isSuper) {    
      bcrypt.compare(req.query.password, admin.hashed_password, function (err,result) {
        if(result) { 
          Admin.find(function(err, admins) {
            if(err) { return handleError(res, err); }
            return res.json(200, readyObject(admins));
          });
        } else {
          return res.json(401, []);
        } 
      });
    } else {
      return res.json(403, {error : true, msg : "Permission denied. Need super admin access"});
    }
  });
};

// Get a single admin
exports.show = function(req, res) {
  if(!req.params.email || !req.query.password) {
    return res.json(403, {error : true, msg : "Email and password are required fields"});
  }
  Admin.findOne({ email : req.params.email }).populate('companies').exec(function(err, admin) {
    if(!admin) { return res.send(404);}
    if(err) { return handleError(res, err); }
    bcrypt.compare(req.query.password, admin.hashed_password, function (err,result) {
      if(result) {
        if(admin.isSuper) {
          Company.find({}, function(err, companies) {
            if(err) { return handleError (res,err); }
            admin.companies = companies;
            return res.json(200, readyObject(admin)); 
          });
        } else { return res.json(200, readyObject(admin)); }
      } else {
        return res.json(401, []);
      } 
    });
  });
};

// Creates a new admin in the DB.
exports.create = function(req, res) {
  if(!req.body.email || !req.body.password) {
    return res.json(403, {error : true, msg : "Email and password are required fields"});
  }
  bcrypt.genSalt(saltSize, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      req.body.hashed_password = hash;
      delete req.body.password;
      Admin.create(req.body, function(err, admin) {
        if(err) { return handleError(res, err); }
        return res.json(201, readyObject(admin));
      });
    });
  });
};

// Updates an existing admin in the DB.
exports.update = function(req, res) {
  // TODO - API reference  
  if(!req.body.email || !req.body.password) {
    return res.json(403, {error : true, msg : "Email and password are required fields"});
  }
  Admin.findOne({ email : req.body.email }, function(err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.send(404);}
    bcrypt.compare(req.body.password, admin.hashed_password, function (err,result) {
      if(result) {
        admin.email = req.body.new_email || admin.email;
        if(typeof(req.body.new_password) !== 'undefined') {
          admin.hashed_password = bcrypt.hashSync(req.body.new_password,bcrypt.genSaltSync(saltSize));
        }
        delete req.body.new_email;
        delete req.body.new_password;
        delete req.body.isSuper; // API can't create super admins
        delete req.body.companies; // API can't modify companies through update
        for(var key in req.body) {
          admin[key] = req.body[key];
        }     
        admin.save(function(err, admin) {
          if(err) { return handleError(res,err); }
          return res.json(200,readyObject(admin));  
        });
      } else {
        return res.json(401, []);
      } 
    });
  });

};

// Deletes a admin from the DB.
exports.destroy = function(req, res) {
  if(!req.body.email || !req.body.password) {
    return res.json(403, {error : true, msg : "Email and password are required fields"});
  }
  Admin.findOne({ email : req.body.email }, function(err, admin) {
    if(!admin) { return res.send(404); }
    if(admin.isSuper) {
      bcrypt.compare(req.body.password, admin.hashed_password, function (err,result) {
        if(result) {
          Admin.remove({ email : req.body.delete_email }, function(err, admin) {
            if(err) { return handleError(res, err); }
            return res.json(200, {error : false, msg : "Successfully deleted"});
          });
        } else {
          return res.json(401, []);
        } 
      });
    } else {
      return res.json(403, {error : true, msg : "Permission denied. Need super admin access"} );
    }
  });
};

exports.create_company = function (req, res) {
  // auth the admin
  if(!req.body.email || !req.body.password) {
    return res.json(403, {error : true, msg : "Email and password of admin are required fields"});
  }
  Admin.findOne({ email : req.body.email }, function(err, admin) {
    if(!admin) { return res.send(404); }
    bcrypt.compare(req.body.password, admin.hashed_password, function (err,result) {
      if(result) {
        console.log(req.body);
        if(!req.body.company || !req.body.company.username || !req.body.company.owner.email || !req.body.company.password) {
          return res.json(403, { error : true, msg : "Company's username/owner's email id or password is missing"});
        }
        req.body.company.hashed_password = bcrypt.hashSync(req.body.company.password, bcrypt.genSaltSync(saltSize));
        delete req.body.company.password;
        // create company
        Company.create(req.body.company, function(err, company) {
          if(err) { return handleError(res, err); }
          if(!admin.isSuper) { 
            admin.companies.push(company._id);
            admin.save();
          }
          return res.json(200, {error : false, msg : "Company added", obj : readyObject(company)}); 
        });

      } else {
        return res.json(401, []);
      } 
    });
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
