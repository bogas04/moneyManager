'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var AgentSchema = new Schema({
  company : { type : Schema.Types.ObjectId, ref : 'Company', index : true},
  name : String,
  email : { type : String , index : true, required : true},
  hashedPassword : String,
  salt : String,
  committees : [{ type : Schema.Types.ObjectId, ref : 'Committee' }],
  customers : [{ type : Schema.Types.ObjectId, ref : 'Customer' }]
});
AgentSchema.index({company : 1, email : 1}, { unique : true} );

/**
 * Virtuals
 */
AgentSchema
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
AgentSchema
.virtual('profile')
.get(function() {
  return {
    'name': this.name,
    'email': this.email,
    'company': this.company
  };
});

// Non-sensitive info we'll be putting in the token
AgentSchema
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

// Validate empty email
AgentSchema
.path('email')
.validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

// Validate empty password
AgentSchema
.path('hashedPassword')
.validate(function(hashedPassword) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');

// Validate email is not taken
AgentSchema
.path('email')
.validate(function(value, respond) {
  var self = this;
  this.constructor.findOne({email: value, company: this.company}, function(err, agent) {
    if(err) throw err;
    if(agent) {
      if(self.id === agent.id) return respond(true);
      return respond(false);
    }
    respond(true);
  });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
AgentSchema
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
AgentSchema.methods = {
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

module.exports = mongoose.model('Agent', AgentSchema);

