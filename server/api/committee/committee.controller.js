'use strict';

var _ = require('lodash');
var Committee = require('./committee.model');

// Get list of committees
exports.index = function(req, res) {
  Committee.find(function (err, committees) {
    if(err) { return handleError(res, err); }
    return res.json(200, committees);
  });
};

// Get a single committee
exports.show = function(req, res) {
  Committee.findById(req.params.id, function (err, committee) {
    if(err) { return handleError(res, err); }
    if(!committee) { return res.send(404); }
    return res.json(committee);
  });
};

// Creates a new committee in the DB.
exports.create = function(req, res) {
  Committee.create(req.body, function(err, committee) {
    if(err) { return handleError(res, err); }
    return res.json(201, committee);
  });
};

// Updates an existing committee in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Committee.findById(req.params.id, function (err, committee) {
    if (err) { return handleError(res, err); }
    if(!committee) { return res.send(404); }
    var updated = _.merge(committee, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, committee);
    });
  });
};

// Deletes a committee from the DB.
exports.destroy = function(req, res) {
  Committee.findById(req.params.id, function (err, committee) {
    if(err) { return handleError(res, err); }
    if(!committee) { return res.send(404); }
    committee.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}