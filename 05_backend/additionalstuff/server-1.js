
var express = require('express');
var http = require('http');

// Calls the express function to start a new Express application
// You call express() which returns a request handler function.
// This means thar we can pass the result into http.createServer
var app = express();

// middleware
app.use(function(request, response, next) {
  console.log("In comes a request to: " + request.url);
  console.log("In comes a request from hostname: " + request.hostname);
  console.log("In comes a request with method: " + request.method);
  // console.log(request.params);
  // console.log(request.params.id);
  // If I put this two here, instead of below, it doesn't fetch the params.
  response.end("Hello, world!");

  next(); //If I don't add next() to this middleware, it doesn't jump to app.get
});
// request and response are two objects
// The request object has properties like request.url, request.hostname,
// request.method, request.query, request.route, request.path, etc,
// and methods like request.get(field), request.is(type), req.param(name [, defaultValue]), etc
// response.end

app.get('/user/:id', function(request, response){
  console.log(request.params);
  console.log(request.params.id);
});

// app is a function and we pass it to http.createServer.
// This function takes a callback that’s called every time a request comes into
// your server, and it returns a server object
http.createServer(app).listen(3000);


// In more lines it could be:
// var server = http.createServer(app); //Creates a server that uses our function
// to handle requests, in this case app
// server.listen(3000); // Stars the erver listening to port 3000
