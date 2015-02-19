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
  committees : [{ type : Schema.Types.ObjectId, ref : 'Committee' }],
  visible_to : [{ type : Schema.Types.ObjectId, ref : 'Agent' }],
  terms : [{
    title : String,
    start_date : Date,
    interest : {
      rate :  Number,
      type : { type : String , enum : ['simple', 'compound'] }
    },
    installments : {
      amount : Number,
      duration : {
        count :  Number,
        parameter : {
          type : String,
          enum : ['days', 'months', 'years']
        }
     }
    },
    logs : {
      date : Date,
      paid : Boolean    
    }
  }]
});
CustomerSchema.index ({phone : 1, company : 1}, {unique : true});

module.exports = mongoose.model('Customer', CustomerSchema);
