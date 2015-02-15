var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Company, config) {
  passport.use('company', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(username, password, done) {
      Company.findOne({
        username: username.toLowerCase()
      }, function(err, company) {
        if (err) return done(err);

        if (!company) {
          return done(null, false, { message: 'This username is not registered.' });
        }
        if (!company.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, company);
      });
    }
  ));
};
