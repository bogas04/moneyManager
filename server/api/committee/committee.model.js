'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/*
 * A customer can participate in same committee multiple times. 
 * So members of the model can have same customer multiple times. 
 * And in the log of a particular date, same customer can be in defaulters list mutltiple times.
 */

var CommitteeSchema = new Schema({
  start_date : Date,
  duration : {
    count : Number,
    parameter : {
      type : String,
      enum : ['days', 'months', 'years']
    },
  },
  members : [{ type : Schema.Types.ObjectId, ref : 'Customer' }],
  visible_to : [{ type : Schema.Types.ObjectId, ref : 'Agent' }],
  logs : [{
    count : Number,
    date : Date,
    defaulters : [{
      type : Schema.Types.ObjectId, ref : 'Customer' 
    }]  
  }]
});

module.exports = mongoose.model('Committee', CommitteeSchema);
