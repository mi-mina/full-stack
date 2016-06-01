var express = require("express");
var http = require("http");
var app = express();

app.use(function (req, res, next) {
  console.log('In comes a '+req.method + " to "+req.url);
  next();
});
// This is just a login middleware. It doesn't modify the request or the response
// It just logs the method and the url.
// It uses next() so that the request is passed to the next middleware in the stack.

// When a request comes in, it always go through the middleware in the  same order
// in which you use them

app.use(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('hello world'); //Sends the information
});

// res.end ends the response process quickly.
// There are other methods, more appropiate to send a response with some data in
// it like, res.send or res.json.

http.createServer(app).listen(3000);
