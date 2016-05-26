var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
// The cookie-parser will parse any cookie that is included in the
// incoming request header and then make it available in the request object.

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(cookieParser('12345-67890-09876-54321'));

function auth (req, res, next) {
  console.log(req.headers);

  if (!req.signedCookies.user) {
    // We check the request object to see if it contains any signedCookie named user
    // If it doesn't means that the user has not authenticated yet and has to do it.
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
      return;
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
      // We set up the cookie
      // res.cookie takes 3 parameters
      res.cookie('user','admin',{signed: true});
      next();
    } else {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
  }
  else {
        if (req.signedCookies.user === 'admin') {
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
};

app.use(auth);

app.use(express.static(__dirname + '/public'));

app.use(function(err,req,res,next) {
            res.writeHead(err.status || 500, {
            'WWW-Authenticate': 'Basic',
            'Content-Type': 'text/plain'
        });
        res.end(err.message);
});


app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
