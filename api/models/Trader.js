/**
 * Trader.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    email: {
      type: 'email',
      email: true,
      required: true,
      unique: true
    },
    lat:{
      type:'string'
    },
    long:{
      type:'string'
    },
    fullName: {
      type: 'string'
    },
    traderId: {
      type: 'string'
    },
    volume:{
      type:'float'
    },
    profileImagePath: {
      type: 'string'
    },
    mobileNumber: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    volume: {
      type: 'float',
      defaultsTo: 0
    },
    encryptedPassword: {
      type: 'string'
    },
    verifyEmail: {
      type: 'boolean',
      defaultsTo: false
    },
    encryptedEmailVerificationOTP: {
      type: 'string'
    },
    encryptedForgotPasswordOTP: {
      type: 'string'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      return obj;
    }
  },
  beforeCreate: function(values, next) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);
        values.encryptedPassword = hash;
        next();
      })
    })
  },
  compareEmailVerificationOTP: function(otp, user, cb) {
    bcrypt.compare(otp, user.encryptedEmailVerificationOTP, function(err, match) {
      if (err) {
        console.log(" cb(err).. findOne.authenticated called.........");
        cb(err);
      }
      if (match) {
        cb(null, true);
      } else {
        console.log("not match.....");
        cb(err);
      }
    })
  },

  compareForgotpasswordOTP: function(otp, user, cb) {
    bcrypt.compare(otp, user.encryptedForgotPasswordOTP, function(err, match) {
      if (err) {
        console.log(" cb(err).. findOne.authenticated called.........");
        cb(err);
      }
      if (match) {
        cb(null, true);
      } else {
        console.log("not match.....");
        cb(err);
      }
    })
  },

  comparePassword: function(password, user, cb = () => {}) {
    bcrypt.compare(password, user.encryptedPassword, function(err, match) {
      return new Promise(function(resolve, reject) {
        if (err) {
          cb(err);
          return reject(err);
        }
        cb(null, match)
        resolve(match);
      })
    })
  },
};
