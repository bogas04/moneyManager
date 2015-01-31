'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema({
  name: String,
  username : {type :String, unique : true },
  hashed_password : String,
  owner : {
    name : String,
    email : String
  },
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
