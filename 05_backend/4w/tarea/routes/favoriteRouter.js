var express = require('express'),
    bodyParser = require('body-parser')
    mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router()
    .use(bodyParser.json());

favoriteRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.find({})
    .populate('postedBy')
    .populate('dishes')
    .exec(function (err, dish) {
      if (err) throw err;
      res.json(dish);
    });
  })

  .post()

  .delete();




    dishRouter.route('/')
      .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.find({})
        .populate('comments.postedBy')
        .exec(function (err, dish) {
          if (err) throw err;
          res.json(dish);
        });
      })
      .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
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
      .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Dishes.remove({}, function (err, resp) {
          if (err) throw err;
          res.json(resp);
        });
      });
