var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Agent, config) {
  passport.use('agent', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password', // this is the virtual field on the model
      passReqToCallback: true
    },
    function(req, email, password, done) {
      Agent.findOne({
        email: email.toLowerCase()
      })
      .populate('company')
      .exec(function(err, agent) {
        if (err) return done(err);
        if (!agent) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (agent.company.username !== req.body.username) {
          return done(null, false, { message: 'This email is not an agent of company '+ req.body.username });
        }
        if (!agent.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, agent);
      });
    }
  ));
};
