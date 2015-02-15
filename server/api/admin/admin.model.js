'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var AdminSchema = new Schema({
  name: String,
  companies : [{type : Schema.Types.ObjectId, ref : 'Company'}],
  email : { type : String, unique : true, lowercase : true },
  hashedPassword : String,
  phone : String,
  isSuper : Boolean,
  salt : String
});


/**
 * Virtuals
 */
AdminSchema
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
AdminSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'companies': this.companies,
      'email': this.email,
      'phone': this.phone,
      'isSuper': this.isSuper
    };
  });

// Non-sensitive info we'll be putting in the token
AdminSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'isSuper': this.isSuper
    };
  });

/**
 * Validations
 */

// Validate empty email
AdminSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
AdminSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
AdminSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, admin) {
      if(err) throw err;
      if(admin) {
        if(self.id === admin.id) return respond(true);
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
AdminSchema
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
AdminSchema.methods = {
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

module.exports = mongoose.model('Admin', AdminSchema);
