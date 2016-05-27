var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// We are assuming that the user information will be sent as a json object
// in the body of the message.
// If you're registering a new user, obviously It makes sense to do a post operation
// on the rest endpoint. Uor endpoint in this case is /register.
// So if the users sends a post to /users/register then that will amount to the user registering.
// We just have to redirect the router to /register, and because this user's module
// is mount on the /users URI, the result endpoint will be /users/register.

router.post('/register', function (req, res) {
  // User.register takes 3 parameters (user, password, callback)
  // Convenience method to register a new user instance with a given password.
  // Checks if username is unique.
  User.register(new User({username: req.body.username}),
    req.body.password, function (err, user) {
      if (err) {
        return res.status(500).json({err: err});
      }
      passport.authenticate('local')(req, res, function () {
        // In app.js we have defined a new local Strategy like thiss:
        // passport.use(new LocalStrategy(User.authenticate()));
        return res.status(200).json({status: 'Registration Successful!'});
      });
    });
});

// Example of Custom callback for the authenticate method used below:
// app.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {...})(req, res, next);
// });
// In this example, note that authenticate() is called from within the route
// handler, rather than being used as route middleware. This gives the callback
// access to the req and res objects through closure.
// If authentication failed, user will be set to false. If an exception occurred,
// err will be set. An optional info argument will be passed, containing
// additional details provided by the strategy's verify callback.
// The callback can use the arguments supplied to handle the authentication
// result as desired. Note that when using a custom callback, it becomes the
// application's responsibility to establish a session (by calling req.login())
// and send a response.

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      // passport makes available the methods logIn and logOut
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      var token = Verify.getToken(user);
      // We return the token to the user
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
  req.logout();
  // We should destroy the token of the user here.
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
