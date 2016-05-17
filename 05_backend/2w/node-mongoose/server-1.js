var mongoose = require('mongoose'),
    assert = require('assert');
var Dishes = require('./models/dishes-1');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  //we're connected!
  console.log('Connected correctly to server');

  // create a new dish
  var newDish = Dishes({
    name: 'Uthapizza',
    description: 'Test'
  });

  // Save the dish
  newDish.save(function (err) {
    if (err) throw err;
    console.log('Dish created!');

    // get all the Dishes
    Dishes.find({}, function (err, dishes) {
      if (err) throw err;
      console.log(dishes);

      db.collection('dishes').drop(function () {
        db.close();
      });
    });
  });
});

// mongoose.connection takes as base a mongoose instance. It inherits
// NodeJS EventEmitter.
// db.on and db.once are methods of the class EventEmitter.
// emitter.on(eventName, listener)
// emitter.once(eventName, listener)
// error and open are events emitted by mongoose.connection

// Model.save takes some options (none in this case) and an optional callback
// function. It returns a promise.
// The promise's events are:
// - err: when the promise is rejected
// - complete: when the promise is fulfilled
