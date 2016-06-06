var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');
var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route("/")

.all(Verify.verifyOrdinaryUser)

.get(function(req, res, next){
    Favorites.findOne({ postedBy : req.decoded._doc._id })
        .populate('postedBy dishes')
        .exec(function (err, favorite) {
            if (err) throw err;
            res.json(favorite);
        });
})

.post(function(req, res, next){
    Favorites.findOne({ postedBy : req.decoded._doc._id }, function(err, favorite){
        if (err) throw err;

        if (favorite == null) {
            Favorites.create({ postedBy : req.decoded._doc._id, dishes : [req.body._id] }, function(err, favorite){
                if (err) throw err;
                console.log('Created Favorites!');
                res.json(favorite);
            });
        } else {
            favorite.dishes.push(req.body._id);
            favorite.save(function(err, favorite){
                if (err) throw err;
                console.log('Updated Favorites!');
                res.json(favorite);
            });
        }
    });
})

.delete(function(req, res, next){
    Favorites.findOneAndRemove({ postedBy : req.decoded._doc._id }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

favoriteRouter.route("/:favoriteId")

.delete(Verify.verifyOrdinaryUser, function(req, res, next){
    // Favorites.findOne({ postedBy : req.decoded._doc._id }, function (err, favorite) {
    //     favorite.dishes.id(req.params.favoriteId).remove();
    //     favorite.save(function (err, resp) {
    //         if (err) throw err;
    //         res.json(resp);
    //     });
    // });

    Favorites.update({postedBy : req.decoded._doc._id}, {$pullAll: {dishes : [req.params.favoriteId]}});
});

module.exports = favoriteRouter;
