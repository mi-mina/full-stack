var express = require('express'),
    bodyParser = require('body-parser')
    mongoose = require('mongoose');

var Dishes = require('../models/dishes');

var dishRouter = express.Router()
    .use(bodyParser.json());

dishRouter.route('/')
  .get(function (req, res, next) {
    // Dishes.find takes 2 arguments. The first arguments is the object we are
    // looking for. In thes case, as it is an empty object, we are asking for
    // all the elements. We will get this back as an array.
    // The second argument is the callback function
    Dishes.find({}, function (err, dish) {
      if (err) throw err;
      res.json(dish);
      // We send the response back as a json string
      // We don't need to add the headers, or the code, they will be added
      // automatically
    });
  })
  .post(function (req, res, next) {
    // Dishes.create takes as first parameter the object to be inserted in the
    // mongoDB. And a callback function as second parameter.
    Dishes.create(req.body, function (err, dish) {
      if (err) throw err;
      console.log('Dish created!');
      var id = dish._id;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Added the dish with id: '+ id);
    });
  })
  .delete(function (req, res, next) {
    res.end('Deleting all dishes');
  });

dishRouter.route('/:dishId')
  .get(function (req, res, next) {
    res.end('Will send details of the dish: ' + req.params.dishId +
    ' to you!');
  })
  .put(function (req, res, next) {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name +
    ' with details: ' + req.body.description);
  })
  .delete(function(req, res, next){
    res.end('Deleting dish: ' + req.params.dishId);
  });

module.exports = dishRouter;
