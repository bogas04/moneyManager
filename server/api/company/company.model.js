'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema({
  name: String,
  owner : String,
  email : String,
  hashed_password : String,
  url : String,
  subscription : {
    type : { type : String, enum : ['fixed', 'one_time']},
    fee : Number
  },
  logs : [{}],
  associate_token : {
    
  } 
});

module.exports = mongoose.model('Company', CompanySchema);
