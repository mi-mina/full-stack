var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var Leaders = require('../models/leadership');
var Verify = require('./verify');

var leadersRouter = express.Router()
    .use(bodyParser.json());

leadersRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Leaders.find({}, function (err, leader) {
      if (err) throw err;
      res.json(leader);
    });
  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leaders.create(req.body, function (err, leader) {
      if (err) throw err;
      console.log('Leader created!');
      var id = leader._id;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Added the leader with id: '+ id);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leaders.remove({}, function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

leadersRouter.route('/:leaderId')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Leaders.findById(req.params.leaderId, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Leaders.findByIdAndRemove(req.params.leadersId, function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

module.exports = leadersRouter;
