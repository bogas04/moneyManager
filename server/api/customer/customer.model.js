'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  company : { type : Schema.Types.ObjectId, ref : 'Company' },
  name : String,
  phone : { type : String, required : true },
  email : String,
  address : {
    title : String,
    coordinates : {
      lattitude : String,
      longitude : String
    }
  },
  comments : [{ comment : String, date : Date }],
  committees : [{ type : Schema.Types.ObjectId, ref : 'Committee' }],
  visible_to : [{ type : Schema.Types.ObjectId, ref : 'Agent' }],
  terms : [{
    title : String,
    startDate : Date,
    amount : Number,
    duration : { // The term is valid for next X months or years
      count : Number,
      parameter : { type : String, enum : ['months', 'years'] }
    },
    interest : {
      rate :  Number,
      type : { type : String , enum : ['EMI', 'Simple'] },
      per : { type : String, enum : ['month', 'anum'] }
    },
    installments : {
      count : Number,  // How many installments
      duration : {     // Taken after every Y days,months or years
        count :  Number,
        parameter : { type : String, enum : ['days', 'months', 'years']}
      }
    },
    logs : [{
      date : Date,
      type : { type : String, enum : ['credit', 'debit'] },
      amount : Number  
    }]
  }]
});
CustomerSchema.index ({phone : 1, company : 1}, {unique : true});

module.exports = mongoose.model('Customer', CustomerSchema);
