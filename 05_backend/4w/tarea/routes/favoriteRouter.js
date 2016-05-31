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
    .populate('postedBy dishes')
    .exec(function (err, favorite) {
      if (err) throw err;
      res.json(favorite);
    });
  })
  .post(Verify.verifyOrdinaryUser, function (req, res, next) {
    req.body.postedBy = req.decoded._doc._id;
    Favorites.find({postedBy: req.body.postedBy}){};

    Favorites.create(req.body, function (err, favorite) {
        if (err) throw err;
        console.log('Favorite dish created!');
        res.json(favorite);
      });


    });
  //
  // .delete();
  //
  // Dishes.findById(req.params.dishId, function (err, dish) {
  //     if (err) throw err;
  //     req.body.postedBy = req.decoded._doc._id;
  //     // What we get in the req.body is the information to create a new comment.
  //     // We assign the property .postedBy the id of the user passed through the token
  //     // before we push the req.body to the array of comments.
  //     dish.comments.push(req.body);
  //     dish.save(function (err, dish) {
  //         if (err) throw err;
  //         console.log('Updated Comments!');
  //         res.json(dish);
  //     });
  // });


module.exports = favoriteRouter;


    // dishRouter.route('/')
    //       .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //     Dishes.create(req.body, function (err, dish) {
    //       if (err) throw err;
    //       console.log('Dish created!');
    //       var id = dish._id;
    //       res.writeHead(200, {
    //         'Content-Type': 'text/plain'
    //       });
    //       res.end('Added the dish with id: '+ id);
    //     });
    //   })
    //   .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //     Dishes.remove({}, function (err, resp) {
    //       if (err) throw err;
    //       res.json(resp);
    //     });
    //   });
