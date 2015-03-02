'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommitteeSchema = new Schema({
  start_date : Date,
  title : { type : String, unique : true },
  company : { type : Schema.Types.ObjectId, ref : 'Company'},
  amount : Number,
  duration : {
    count : Number,
    parameter : {
      type : String,
      enum : ['months', 'years']
    },
  },
  logs : [{
    date : Date,
    bidAmount : Number,
    takenBy : { type : Schema.Types.ObjectId, ref : 'Customer'}
  }],
  members : {
    count : Number,
    list : [{ 
      details : { type : Schema.Types.ObjectId, ref : 'Customer' }, 
      count : { type : Number, default : 1 }
    }]
  },
  visible_to : [{ type : Schema.Types.ObjectId, ref : 'Agent' }]
});

module.exports = mongoose.model('Committee', CommitteeSchema);
