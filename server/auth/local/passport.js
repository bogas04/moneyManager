var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Admin, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      Admin.findOne({
        email: email.toLowerCase()
      }, function(err, admin) {
        console.log(err);
        console.log(admin);
        console.log("Hello");
        if (err) return done(err);

        if (!admin) {
          return done(null, false, { message: 'This email is not at all registered.' });
        }
        if (!admin.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, admin);
      });
    }
  ));
};
