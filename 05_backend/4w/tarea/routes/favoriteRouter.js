var express = require('express'),
    bodyParser = require('body-parser')
    mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router()
    .use(bodyParser.json());

favoriteRouter.route('/')
  .all(Verify.verifyOrdinaryUser)
  .get(function (req, res, next) {
    Favorites.find({postedBy: req.decoded._doc._id})
      .populate('postedBy dishes')
      .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
  })
  .post(function (req, res, next) {

    // Model.findOneAndUpdate(conditions, update, options, callback)
    // conditions----------
    // As a condition we want {postedBy: userId}
    // Update------
    // Mongo has Array Update Operators like $addToSet that
    // adds a value to an array unless the value is already present,
    // in which case $addToSet does nothing to that array.
    // Using $addToSet we don't have to do any extra validation to be sure
    // that we won't dupplicate the favorites dishes
    // Options-----------
    // As options we want that if the favorite doesn't exist, a new one will
    // be created.
    // We use upsert: boolean that creates the object if it doesn't exist.
    // new: if true, return the modified document rather than the original

    Favorites.findOneAndUpdate({postedBy: req.decoded._doc._id},
      {$addToSet: {dishes: req.body._id}},
      {upsert: true,
      new: true},
      function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
      });
    )
  })
  .delete(function (req, res, next) {
    Favorites.findOneAndRemove({postedBy: req.decoded._doc._id},
      function (err, resp) {
        if (err) throw err;
        console.log('Deleted all favorites!');
        res.json(resp);
      });
  });

favoriteRouter.route('/:dishObjectId')
  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOneAndUpdate({postedBy: req.decoded._doc._id},
    {$pull: {dishes: req.params.dishObjectId}},
    {new: true}, function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });


module.exports = favoriteRouter;
