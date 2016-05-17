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
  Dishes.create({
    name: 'Uthapizza',
    description: 'Test'
  }, function (err, dish) {
    if (err) throw err;
    console.log('Dish created!');
    console.log(dish);
    var id = dish._id;

    // get all the dishes
    setTimeout(function () {
      // We have just created the query, not executed it
      Dishes.findByIdAndUpdate(id,{
        $set: {
          description: 'Updated Test'
        }
      }, {
          new: true
      })
      .exec(function (err, dish) {
        // With exec we execute the query. We can chain the function.
        if (err) throw err;
        console.log('Updated Dish!');
        console.log(dish);

        db.collection('dishes').drop(function () {
          db.close();
        });
      });
    }, 3000);
    // The created and updated fields will be different

  });

});

// Model.create(docs(s),[callback]) is a shortcut for creating a new Document
// that is automatically saved to the db if valid.
// We have done it before in two separated steps

// Model.findByIdAndUpdate(id, [update], [options], [callback])
// Options:
// new: bool - true to return the modified document rather than the original.
// defaults to false
// Returns a query.

// Query.exec([operation], [callback])
