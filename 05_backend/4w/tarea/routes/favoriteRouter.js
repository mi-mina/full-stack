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
          console.log('voy a actualizar un favorite existente');
          console.log(myFavorites);
          console.log(myFavorites[0]);
          if (myFavorites[0].dishes.indexOf(req.body._id) < 0) {
            myFavorites[0].dishes.push(req.body._id);
            myFavorites[0].save(function (err, favorite) {
              if (err) throw err;
              console.log('Favorite updated!');
              console.log(myFavorites);
              console.log(favorite);
              res.send(favorite);
            });
          } else {
            res.send('Ya has añadido ese plato a favoritos');
          };
        } else {
          console.log('voy a crear un favorites nuevo');
          console.log(req.body); //el body tiene un id = que el del plato por que?
          // yo quiero crear un elemento con una id unica cada vez
          Favorites.create(req.body, function (err, favorite) {
            if (err) throw err;
            console.log(req.body);
            console.log('Favorite dish created!');
            res.json(favorite);
          });
        };
      });
    });

    favoriteRouter.route('/:id')
      .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({postedBy: req.params.id})
          .exec(function (err, favorite) {
            if (err) throw err;
            res.json(favorite);
        });
      });

    // When the user does a POST operation on '/favorites' by including
    // {"_id":"dish ObjectId"} in the body of the message, you will
    // (a) create a favorites document if such a document corresponding to this
    // user does not already exist in the system,
    // (b) add the dish specified in the body of the message to the list of favorite
    // dishes for the user, if the dish does not already exists in the list of favorites.

module.exports = favoriteRouter;
