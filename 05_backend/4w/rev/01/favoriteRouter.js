var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Favorites = require('../models/favorites');
var favoriteRouter = express.Router();
var Dishes = require('../models/dishes');
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({ postedBy: req.decoded._doc._id })
        .populate('postedBy')
        .populate('dishes')
        .exec(function (err, fav) {
        if (err) throw err;
        res.json(fav);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.body._id, function (err, dish) {
        if (dish) {
          Favorites.findOne({ postedBy: req.decoded._doc._id }, function (err, fav) {
            if (err) throw err;
            if (fav) {
            var dishindex = fav.dishes.indexOf(dish._id)+1;

                        if (dishindex > 0) {
                            var err = new Error('Already a favorite!');
                            err.status = 409;
                            return next(err);
                        }
                        else {
                            fav.dishes.push(dish._id);
                            fav.save(function (err, fav) {
                                if (err) throw err;
                                    res.json(fav);});}}
            else {
              var favdish = {
              postedBy: req.decoded._doc._id,
              dishes: [{_id:req.body._id}]};
              Favorites.create(favdish, function (err,fav) {
              if (err) throw err;
                res.json(fav);
            });
          }
                });}
            else {
                var err = new Error('No such Dish!');
                err.status = 404;
                return next(err);
            }})})

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.remove({ postedBy: req.decoded._doc._id }, function (err, resp) {
                if (err) throw err;
                res.json(resp);});
    });

favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({ postedBy: req.decoded._doc._id }, function (err, fav) {
            if (err) throw err;
            if (!fav) {
                var err = new Error('Not Found!');
                err.status = 404;
                return next(err);}

            else {
                var di = fav.dishes.indexOf(req.params.dishId)+1;
                if (di <= -1) {
                    var err = new Error('Operation not done');
                    err.status = 409;
                    return next(err);}

                else {
                    fav.dishes.splice(di, 1);
                    fav.save(function (err, response) {
                        if (err) throw err;
                        res.json(response);}
            );}}
        });});


module.exports = favoriteRouter;
