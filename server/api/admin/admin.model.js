'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AdminSchema = new Schema({
  name: String,
  companies : [{type : Schema.Types.ObjectId, ref : 'Company'}],
  email : { type : String, unique : true },
  hashed_password : String,
  phone : String,
  isSuper : Boolean

});

module.exports = mongoose.model('Admin', AdminSchema);
