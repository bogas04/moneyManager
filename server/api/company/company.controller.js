'use strict';
var _ = require('lodash');
var Company = require('./company.model');
var Agent = require('../agent/agent.model');
var Customer = require('../customer/customer.model');
var bcrypt = require('bcrypt');
var saltSize = 10;

/*
===========================
  Company related queries  
===========================
*/

// Get a single company
exports.show = function(req, res) {
  if(!req.params.username || !req.query.password) {
    return res.json(403, {error : true, msg : "Username and password are required fields"});
  }
  Company.findOne( { username : req.params.username }, function (err, company) {
    if(err) { return handleError(res, err); }
    if(!company) { return res.send(404); }
    bcrypt.compare(req.query.password, company.hashed_password, function (err, result) {
      if(result) { return res.json(200, { error : false, msg : "Company retrieved" , data : readyObject(company) }); }
      else { return res.json(401, { error : true, msg : "Invalid password", data : null}); } 
    });
  });
};

// Updates an existing company in the DB.
exports.update = function(req, res) {
  if(!req.params.username || !req.body.password) {
    return res.json(403, {error : true, msg : "Username and password are required fields"});
  }
  if(req.body._id) { delete req.body._id; }
  Company.findOne({ username : req.params.username}, function (err, company) {
    if (err) { return handleError(res, err); }
    if(!company) { return res.send(404); }
    console.log(req.body); 
    console.log(company);
    bcrypt.compare(req.body.password, company.hashed_password, function (err, result) {
      if(result) {
        req.body.username = req.body.new_username || company.username; 
        req.body.hashed_password = req.body.new_password ? (
            bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(saltSize))
        ) : company.hashed_password;
        
        delete req.body.new_username;
        delete req.body.new_password;
        delete req.body.password;
        delete req.body.logs;

        var updated = _.merge(company, req.body);
        updated.save(function(err,company) {
          if (err) { return handleError(res, err); }
          return res.json(200, company);
        });
        return res.json(200, { error : false, msg : "Company updated" , data : readyObject(company) });
      } else { return res.json(401, {error : true, msg : "Invalid password", data : null}); } 
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
  if(!req.params.username || !req.query.password) {
    return res.json(403, {error : true, msg : "Username and password are required fields"});
  }
  Company.findOne({username : req.params.username}, function(err, company) {
    if(err) { return handleError(res, err); }
    if(!company) { return res.json(404, { error : true, msg : "Company not found", data : null}); }
    bcrypt.compare(req.query.password, company.hashed_password, function(err, result) {
      if(result) {
        Agent.find({company : company._id}, function(err, agents) {
          if(err) { return handleError(res, err); }
          return res.json(200, { error : false , msg : "Agents retrieved", data : readyObject(agents) }); 
        });
      } else { return res.json(401,{ error : true, msg : "Invalid password", date : null }); }
    });
  });
};

// Create agent 
exports.create_agents = function(req, res) {
  if(!req.params.username || !req.body.password) {
    return res.json(403, {error : true, msg : "Username and password are required fields"});
  }
  Company.findOne({username : req.params.username}, function(err, company) {
    bcrypt.compare(req.body.password, company.hashed_password, function(err, result) {
      if(result) {
        req.body.agent.hashed_password = bcrypt.hashSync(req.body.agent.password, bcrypt.genSaltSync(saltSize));       
        req.body.agent.company = company._id;
        delete req.body.agent.password;
        Agent.create(req.body.agent, function(err, agent) {
          if(err) { return handleError(res, err); }
          if(!agent) { return res.json(500, { error : true, msg : "Internal DB error", data :null}); }
          return res.json(201, { error : false , msg : "Agent created", data : readyObject(agent)});
        });       
      } else { return res.json(401,{ error : true, msg : "Invalid password", date : null }); }
    });
  });
};

/*
============================
  Customer related queries  
============================
*/

// Get list of agents 
exports.retrieve_customers = function(req, res) {
  if(!req.params.username || !req.query.password) {
    return res.json(403, {error : true, msg : "Username and password are required fields"});
  }
  Company.findOne({username : req.params.username}, function(err, company) {
    if(err) { return handleError(res, err); }
    if(!company) { return res.json(404, { error : true, msg : "Company not found", data : null}); }
    bcrypt.compare(req.query.password, company.hashed_password, function(err, result) {
      if(result) {
        Customer.find({company : company._id}, function(err, customers) {
          if(err) { return handleError(res, err); }
          return res.json(200, { error : false , msg : "Customers retrieved", data : customers }); 
        });
      } else { return res.json(401,{ error : true, msg : "Invalid password", date : null }); }
    });
  });
};

/*
====================
  Helper Functions  
====================
*/

function handleError(res, err) {
  return res.send(500, err);
}
function readyObject(obj, filters) {
  if(!filters) {
    var filters = ['hashed_password'];
  }
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
