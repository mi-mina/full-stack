var http = require('http');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function (req, res) {


});

server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
