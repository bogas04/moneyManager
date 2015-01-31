'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentSchema = new Schema({
  company : { type : Schema.Types.ObjectId, ref : 'Company', index : true},
  name : String,
  email : { type : String , index : true},
  hashed_password : String,
  committees : [{ type : Schema.Types.ObjectId, ref : 'Committee' }],
  customers : [{ type : Schema.Types.ObjectId, ref : 'Customer' }]
});
AgentSchema.index({company : 1, email : 1}, { unique : true} );
module.exports = mongoose.model('Agent', AgentSchema);
