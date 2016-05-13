var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();
// Creates an express application

app.use(morgan('dev'));
// app.use([path,] function [, function...])
// Mounts the specified middleware function or functions at the specified path.
// If path is not specified, it defaults to “/”.

// 'dev' is one of the preformatted log outputs that morgan supports

// Method:
// express.static(root, [options])

app.use(express.static(__dirname + '/public'));
// The public folder contains all the files that will be served as static files
// by this particular server
// __dirname indica una ruta relativa

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Nos hemos saltado el paso intermedio de crear var server = http.createServer
// Aplicamos el método .listen directamente a app, porque express se encarga de hacerlo
