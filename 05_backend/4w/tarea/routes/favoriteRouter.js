var express = require('express'),
    bodyParser = require('body-parser')
    mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router()
    .use(bodyParser.json());

favoriteRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    req.body.postedBy = req.decoded._doc._id;
    Favorites.find({postedBy: req.body.postedBy})
      .populate('postedBy dishes')
      .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
  })
  .post(Verify.verifyOrdinaryUser, function (req, res, next) {
    req.body.postedBy = req.decoded._doc._id;
    req.body.dishes = req.body._id;
    req.body._id = new mongoose.Types.ObjectId;

    Favorites.find({postedBy: req.body.postedBy})
      .exec(function (err, myFavorites) {
        if (err) throw err;
        if (myFavorites[0]) {
          if (myFavorites[0].dishes.indexOf(req.body._id) < 0) {
            myFavorites[0].dishes.push(req.body.dishes);
            myFavorites[0].save(function (err, favorite) {
              if (err) throw err;
              console.log('Favorite dish added!');
              res.send(favorite);
            });
          } else {
            res.send('You have already added this dish to your favorites dishes');
          };
        } else {
          Favorites.create(req.body, function (err, favorite) {
            if (err) throw err;
            console.log('Favorite dish created!');
            res.json(favorite);
          });
        };
      });
    })
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
      req.body.postedBy = req.decoded._doc._id;
      Favorites.find({postedBy: req.body.postedBy})
        .exec(function (err, myFavorites) {
          if (err) throw err;
          myFavorites[0].remove();
          res.end('Deleted all favorites!');
        });
    });

favoriteRouter.route('/:dishObjectId')
  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    req.body.postedBy = req.decoded._doc._id;
    Favorites.find({postedBy: req.body.postedBy})
    .exec(function (err, myFavorites) {
      if (err) throw err;
      var index = myFavorites[0].dishes.indexOf(req.params.dishObjectId);
      if (index < 0) {
        console.log('Favorite dish not found');
      }else{
        myFavorites[0].dishes.splice(index, 1);
        myFavorites[0].save(function (err, resp) {
          if (err) throw err;
          res.json(resp);
        })
      };
    });
  });


module.exports = favoriteRouter;
