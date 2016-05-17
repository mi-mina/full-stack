var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

//Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  assert.equal(err,null);
  console.log('Connected correctly to server');

  var collection = db.collection('dishes');

  collection.insertOne({name: 'Uthapizza', description: 'Test'},
    function (err, result) {
      assert.equal(err,null);
      console.log('After Insert: ');
      console.log(result.ops);

      collection.find({}).toArray(function (err,docs) {
        assert.equal(err,null);
        console.log("Found: ");
        console.log(docs);

        db.dropCollection('dishes', function (err, result) {
          assert.equal(err,null);
          db.close();
        });
      });
    });

});

//Note the use of callback functions in every step. The reason for this
//is that a database query needs time. So we have to wait for the operation
//to be served and then the database server will callback this function
//to return the value to our node application

//.toArray will convert the return value into an array of documents and that
//is what we are going to print out to the screen

//After we printout the return array to the screen we drop the collection
//because we want to restore the db to his pristine condition. We wouldn't
// do that in a real database
