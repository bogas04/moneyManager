'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentSchema = new Schema({
  name : String,
  email : String,
  hashed_password : String,
  committees : [{ type : Schema.Types.ObjectId, ref : 'Committee' }],
  customers : [{ type : Schema.Types.ObjectId, ref : 'Customer' }]
});

module.exports = mongoose.model('Agent', AgentSchema);
