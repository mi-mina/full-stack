var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites')
// Used to check if the user specified dish exists
var Dishes = require('../models/dishes');

var favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({ postedBy: req.decoded._doc._id })
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        // Before doing anything else, check to see if the specified
        //  dish objectId exists
        Dishes.findById(req.body._id, function (err, dish) {

            // If dish exists
            if (dish) {

                // Check to see if there's a favorite object for current user
                Favorites.findOne({ postedBy: req.decoded._doc._id }, function (err, favorite) {
                    if (err) throw err;

                    // If there is a favorite object for current user
                    if (favorite) {
                          
                        var indexOfDish = favorite.dishes.indexOf(dish._id);
                        
                        // If dish is already favorited by the user
                        if (indexOfDish >= 0) {
                            var err = new Error('Specified dish already is favorited by the user!');
                            err.status = 409;
                            return next(err);
                        }

                        // If dish is not favorited by the user
                        else {
                            favorite.dishes.push(dish._id);
                            favorite.save(function (err, favorite) {
                                if (err) throw err;
                                res.json(favorite);
                            });
                        }
                    }

                    // If there is no favorite object for current user
                    else {
                        var favoriteObject = {
                            postedBy: req.decoded._doc._id,
                            dishes: [
                                { _id: req.body._id }
                            ]
                        };

                        Favorites.create(favoriteObject, function (err, favorite) {
                            if (err) throw err;
                            res.json(favorite);
                        });
                    }
                });
            }

            // If specified dish doesn't exists
            else {
                var err = new Error('Dish not found!');
                err.status = 404;
                return next(err);
            }
        })
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.remove({ postedBy: req.decoded._doc._id }, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

favoritesRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({ postedBy: req.decoded._doc._id }, function (err, favorite) {
            if (err) throw err;
            
            console.log(favorite);

            // If there was no favorite for the current user
            if (!favorite) {
                var err = new Error('Favorite not found!');
                err.status = 404;
                return next(err);
            }
            // If there was a favorite for the current user
            else {
                // The array of the specified dish in the dishes array
                var indexOfElement = favorite.dishes.indexOf(req.params.dishId);
                console.log(indexOfElement);
                // If the specified dish is not in the user's favorite list
                if (indexOfElement <= -1) {
                    var err = new Error('Dish is not favorited!');
                    err.status = 409;
                    return next(err);
                }

                // If the specified dish is in the user's favorite list
                else {
                    // Remove the specified dish from the favorite's dishes array
                    favorite.dishes.splice(indexOfElement, 1);
                    favorite.save(function (err, response) {
                        if (err) throw err;

                        res.json(response);
                    });
                }
            }
        });
    });

module.exports = favoritesRouter;