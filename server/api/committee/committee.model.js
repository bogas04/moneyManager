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
  title : { type : String, unique : true },
  company : { type : Schema.Types.ObjectId, ref : 'Company'},
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
    date : Date,
    defaulters : [{
      type : Schema.Types.ObjectId, ref : 'Customer' 
    }]  
  }]
});


/**
 * Virtuals
 */
CommitteeSchema
  .virtual('currentIteration')
  .set(function(currentIteration) {})
  .get(function() {
    var elapsedDays = ((new Date()).getTime() - start_date.getTime())/(1000*3600*24);
    switch(this.duration.parameter) {
      case 'months' :
        // BUGGY!
        elapsedDays /= 30;
        break;
      case 'years' :
        // BUGGY
        elapsedDays /= 365;
        break;
    }
    return elapsedDays;
  });
module.exports = mongoose.model('Committee', CommitteeSchema);
