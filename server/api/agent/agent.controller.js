'use strict';

var _ = require('lodash');
var Agent = require('./agent.model');
var Customer = require('../customer/customer.model');
var Committee = require('../committee/committee.model');
var Company = require('../company/company.model');
var bcrypt = require('bcrypt');
var saltSize = 10;
/*
=========================
  Agent related queries  
=========================
*/

// Get a single agent
exports.show = function(req, res) {
  if(!req.params.company || !req.params.email || !req.query.password) {
    return res.json(403, { error : true, msg : "Company username, email and password are required fields", data : null});
  }
  Agent.findOne({ email : req.params.email}).populate('company customers').exec(function (err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { return res.send(404); }
    console.log(agent);
    if(agent.company.username != req.params.company) { 
      return res.json(403, {error : true, msg : "Agent doesn't belong to the company", data :null}); 
    }
    bcrypt.compare(req.query.password, agent.hashed_password, function(err, result) {
      if(result) {
        return res.json(readyObject(agent));
      } else {
        return res.json(403, { error : true, msg : "Invalid password for "+agent.email+" agent", data :null});
      }  
    });
  });
};

// Updates an existing agent in the DB.
exports.update = function(req, res) {
  if(!req.params.company || !req.params.email || !req.body.password) {
    return res.json(403, { error : true, msg : "Company username, email and password are required fields", data : null});
  }
  Agent.findOne({ email : req.params.email}).populate('company').exec(function (err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { return res.send(404); }
    if(agent.company.username != req.params.company) { 
      return res.json(403, {error : true, msg : "Agent doesn't belong to the company", data :null}); 
    }
    bcrypt.compare(req.body.password, agent.hashed_password, function(err, result) {
      if(result) {
        req.body.hashed_password = req.body.new_password? (
          bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(saltSize))    
        ) : agent.hashed_password;
        req.body.email = req.body.new_email || req.body.email;
        delete req.body.password;
        delete req.body.new_password;
        delete req.body.new_email;
        delete req.body.company;
        var updated = _.merge(agent, req.body);
        updated.save(function(err, new_agent) {
          if(err) { return handleError(res, err); }
          if(!new_agent) { return res.json(500,{error : true, msg : "Internal DB error", data : null}); }
          return res.json(200, { error : false , msg :"Agent updated", data : readyObject(new_agent)});
        });
      } else {
        return res.json(403, { error : true, msg : "Invalid password for "+agent.email+" agent", data :null});
      }  
    });
  });
};

/*
============================
  Customer related queries  
============================
*/

exports.create_customer = function(req, res) {
  if(!req.params.company || !req.params.email || !req.body.password) {
    return res.json(403, { error : true, msg : "Company username, email and password are required fields", data : null});
  }
  if(!req.body.customer || !req.body.customer.phone) {
    return res.json(403, { error : true, msg : "Customer phone number is a required field", data : null});
  }
  Agent.findOne({ email : req.params.email}).populate('company').exec(function (err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { return res.send(404); }
    if(agent.company.username != req.params.company) { 
      return res.json(403, {error : true, msg : "Agent doesn't belong to the company", data :null}); 
    }
    bcrypt.compare(req.body.password, agent.hashed_password, function(err, result) {
      if(result) {
        delete req.body.customer.committees;
        delete req.body.customer.logs;
        req.body.customer.visible_to = [agent._id];
        req.body.customer.company = agent.company._id;
        Customer.create(req.body.customer, function(err, customer) {
          if(err) { return handleError(res, err); }
          if(!customer) { return res.json(500, {error : true, msg : "Internal DB error", data : null}); }
          agent.customers.push(customer._id);
          agent.save(function(err, new_agent) {
            // if(err) add to logs
            return res.json(201, { error : false, msg : "Customer created successfuly", data : customer});
          });
        }); 
      } else {
        return res.json(403, { error : true, msg : "Invalid password for "+agent.email+" agent", data :null});
      }  
    });
  });
};

exports.retrieve_customer = function(req, res) {
  if(!req.params.company || !req.params.email || !req.query.password) {
    return res.json(403, { error : true, msg : "Company username, email and password are required fields", data : null});
  }
  if(!req.query.phone) {
    return res.json(403, { error : true, msg : "Customer phone number is a required field", data : null});
  }
  Agent.findOne({ email : req.params.email}).populate('company').exec(function (err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { return res.send(404); }
    if(agent.company.username != req.params.company) { 
      return res.json(403, {error : true, msg : "Agent doesn't belong to the company", data :null}); 
    }
    bcrypt.compare(req.query.password, agent.hashed_password, function(err, result) {
      if(result) {
        Customer.findOne({ phone : req.query.phone, visible_to : agent._id}, function (err, customer) {
          if(err) { return handleError(res, err); }
          if(!customer) { return res.json(404, { error : true, msg : "No such customer found", data : null }); }
          return res.json(201, { error : false, msg : "Customer retrieved successfuly", data : customer});
        });
      } else {
        return res.json(403, { error : true, msg : "Invalid password for "+agent.email+" agent", data :null});
      }  
    });
  });
};

exports.update_customer = function(req, res) {
  if(!req.params.company || !req.params.email || !req.body.password) {
    return res.json(403, { error : true, msg : "Company username, email and password are required fields", data : null});
  }
  if(!req.body.customer || !req.body.customer.phone) {
    return res.json(403, { error : true, msg : "Customer phone number is a required field", data : null});
  }
  Agent.findOne({ email : req.params.email}).populate('company').exec(function (err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { return res.send(404); }
    if(agent.company.username != req.params.company) { 
      return res.json(403, {error : true, msg : "Agent doesn't belong to the company", data :null}); 
    }
    bcrypt.compare(req.body.password, agent.hashed_password, function(err, result) {
      if(result) {
        Customer.findOne({ phone : req.query.phone, visible_to : agent._id}, function (err, customer) {
          if(err) { return handleError(res, err); }
          if(!customer) { return res.json(404, { error : true, msg : "No such customer found", data : null }); }
          delete req.body.customer._id;
          var updated = _.merge(customer, req.body.customer);
          customer.save(req.body.customer, function(err, up_customer) {
            if(err) { return handleError(res, err); }
            if(!up_customer) { return res.json(500, {error : true, msg : "Internal DB error", data : null }); }
            return res.json(201, { error : false, msg : "Customer updated successfuly", data : customer});
          });
        }); 
      } else {
        return res.json(403, { error : true, msg : "Invalid password for "+agent.email+" agent", data :null});
      }  
    });
  });
};


exports.destroy_customer = function(req, res) {
  if(!req.params.company || !req.params.email || !req.body.password) {
    return res.json(403, { error : true, msg : "Company username, email and password are required fields", data : null});
  }
  if(!req.body.customer || !req.body.customer.phone) {
    return res.json(403, { error : true, msg : "Customer phone number is a required field", data : null});
  }
  Agent.findOne({ email : req.params.email}).populate('company').exec(function (err, agent) {
    if(err) { return handleError(res, err); }
    if(!agent) { return res.send(404); }
    if(agent.company.username != req.params.company) { 
      return res.json(403, {error : true, msg : "Agent doesn't belong to the company", data :null}); 
    }
    bcrypt.compare(req.body.password, agent.hashed_password, function(err, result) {
      if(result) {
        Customer.remove( { phone : req.body.customer.phone }, function(err) {
          if(err) { return handleError(res, err); }
          return res.json(201, { error : false, msg : "Customer deleted successfuly", data : null});
        }); 
      } else {
        return res.json(403, { error : true, msg : "Invalid password for "+agent.email+" agent", data :null});
      }  
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
      if(obj.company && filters[f] in obj.company) { delete obj.company[filters[f]]; }
    }
  }
  return obj;
}
