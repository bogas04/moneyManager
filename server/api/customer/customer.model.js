'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name : String,
  phone : String,
  email : String,
  address : {
    title : String,
    coordinates : {
      lattitude : String,
      longitude : String
    }
  },
  committees : [{ type : Schema.Types.ObjectId, ref : 'Committee' }],
  logs : [{ 
    term : String,
    date : Date,
    paid : Boolean,  
  }],
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
    }
  }]
});

module.exports = mongoose.model('Customer', CustomerSchema);
