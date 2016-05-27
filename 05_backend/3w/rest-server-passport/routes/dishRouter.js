var express = require('express'),
    bodyParser = require('body-parser')
    mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');

var dishRouter = express.Router()
    .use(bodyParser.json());

dishRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    // Dishes is a model. Methods available to models are in model.js in the
    // mongoose API.
    // Dishes.find takes 2 arguments. The first arguments is the object we are
    // looking for. It's an object with conditions (like a filter)
    // In this case, as it is an empty object, we are asking for
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
  .post(Verify.verifyOrdinaryUser, function (req, res, next) {
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
  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    // If we invoke Dishes.remove whith an empty object as a first parameter,
    // we will delete all the items in the collection
    // The resp of the callback function will be a javascript object thal will
    // indicate how many objects has been deleted
    Dishes.remove({}, function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

dishRouter.route('/:dishId')
  .get(function (req, res, next) {
    // The Id comes as a parameter and with have access to it by req.params.dishId
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
  })
  .put(function (req, res, next) {
    // My expectation is that the update information comes in the body of the message
    // that's why {$set: req.body}
    // new: true -> true to return the modified document rather than the original.
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }, function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
  })
  .delete(function(req, res, next){
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

  dishRouter.route('/:dishId/comments')
  .get(function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
          if (err) throw err;
          res.json(dish.comments);
      });
  })
  .post(function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
          if (err) throw err;
          dish.comments.push(req.body);
          dish.save(function (err, dish) {
              if (err) throw err;
              console.log('Updated Comments!');
              res.json(dish);
          });
      });
  })
  .delete(function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
          if (err) throw err;
          for (var i = (dish.comments.length - 1); i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save(function (err, result) {
              if (err) throw err;
              res.writeHead(200, {
                  'Content-Type': 'text/plain'
              });
              res.end('Deleted all comments!');
          });
      });
  });

  dishRouter.route('/:dishId/comments/:commentId')
  .get(function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
          if (err) throw err;
          res.json(dish.comments.id(req.params.commentId));
      });
  })
  .put(function (req, res, next) {
      // We delete the existing commment and insert the updated
      // comment as a new comment
      Dishes.findById(req.params.dishId, function (err, dish) {
          if (err) throw err;
          dish.comments.id(req.params.commentId).remove();
          dish.comments.push(req.body);
          dish.save(function (err, dish) {
              if (err) throw err;
              console.log('Updated Comments!');
              res.json(dish);
          });
      });
  })
  .delete(function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
          dish.comments.id(req.params.commentId).remove();
          dish.save(function (err, resp) {
              if (err) throw err;
              res.json(resp);
          });
      });
  });

module.exports = dishRouter;
