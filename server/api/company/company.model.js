'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var CompanySchema = new Schema({
  name: String,
  username : {type :String, unique : true },
  hashedPassword : String,
  salt : String,
  owner : {
    name : String,
    email : String
  },
  url : String,
  subscription : {
    type : { type : String, enum : ['fixed', 'one_time']},
    fee : Number,
    options : {
      agents : { type : Boolean, default : true },
      lending : { type : Boolean, default : true },
      committees : { type : Boolean, default : true }
    }
  },
  logs : [{}],
});

/**
 * Virtuals
 */
CompanySchema
.virtual('password')
.set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
})
.get(function() {
  return this._password;
});

// Public profile information
CompanySchema
.virtual('profile')
.get(function() {
  return {
    'name': this.name,
    'username': this.username,
    'owner': this.owner,
    'url': this.url,
    'subscription': this.subscription
  };
});

// Non-sensitive info we'll be putting in the token
CompanySchema
.virtual('token')
.get(function() {
  return {
    '_id': this._id,
    'name': this.name
  };
});

/**
 * Validations
 */

// Validate empty username
CompanySchema
.path('username')
.validate(function(username) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'Username cannot be blank');

// Validate empty password
CompanySchema
.path('hashedPassword')
.validate(function(hashedPassword) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');

// Validate username is not taken
CompanySchema
.path('username')
.validate(function(value, respond) {
  var self = this;
  this.constructor.findOne({username: value}, function(err, company) {
    if(err) throw err;
    if(company) {
      if(self.id === company.id) return respond(true);
      return respond(false);
    }
    respond(true);
  });
}, 'The specified username address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
CompanySchema
.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'));
  else
    next();
});

/**
 * Methods
 */
CompanySchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Company', CompanySchema);

