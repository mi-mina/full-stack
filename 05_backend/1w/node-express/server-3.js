var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    hostname = 'localhost',
    port = 3000;

// BodyParser enables us to parse the data that comes in in the request body,
// and then convert it into JavaScript objects that are available in our
// request message. So it parses the data and then adds it as a JavaScript
// object to req.

var app = express()
  .use(morgan('dev'))
  .use(bodyParser.json())
  .all('/dishes', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
  })
  .get('/dishes', function (req, res, next) {
    res.end('Will send all the dishes to you!');
  })
  .post('/dishes', function (req, res, next) {
    res.end('Will add the dish: '+ req.body.name + ' with details: ' +
    req.body.description);
  })
  .delete('/dishes', function (req, res, next) {
    res.end('Deleting all dishes');
  })
  .get('/dishes/:dishId', function (req, res, next) {
    res.end('Will send details of the dish: ' + req.params.dishId +
    ' to you!');
  })
  .put('/dishes/:dishId', function (req, res, next) {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name +
    ' with details: ' + req.body.description);
  })
  .delete('/dishes/:dishId', function(req, res, next){
    res.end('Deleting dish: ' + req.params.dishId);
  })
  .use(express.static(__dirname + '/public'))
  .listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
  });

// We call the next function in order that the parsing continue from this
// point onwards.
// We don't call next() in the get, post, or delete. This means that processing
// will be terminated at the point and then the reply will be returned to the
// client.
