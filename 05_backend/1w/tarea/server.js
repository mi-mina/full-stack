var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    dishRouter = require('./dishRouter'),
    leaderRouter = require('./leaderRouter'),
    promoRouter = require('./promoRouter'),
    hostname = 'localhost',
    port = 3000;

var app = express()
  .use(morgan('dev'))
  .use('/dishes', dishRouter)
  .use('/leadership', leaderRouter)
  .use('/promotions', promoRouter)
  .use(express.static(__dirname + '/public'))
  .listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
  });
