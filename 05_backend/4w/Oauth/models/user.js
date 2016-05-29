var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Supongo que lo anterior se puede compactar en una sola línea así:
// var Schema = require('mongoose').Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  password: String,
  OauthId: String,
  OauthToken: String,
  firstname: {
    type: String,
    default: ''},
  lastname: {
    type: String,
    default: ''},
  admin: {
    type: Boolean,
    default: false
  }
});

User.methods.getName = function () {
  return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);
// we apply the passport-local-mongoose plugin to our User Schema
// Then we will be able to use the methods provided by passport-local-mongoose
// like register, authenticate, serializeUser, findByUsername...

module.exports = mongoose.model('User', User);
