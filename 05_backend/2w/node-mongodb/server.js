var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var dboper = require('./operations');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    dboper.insertDocument(db, { name: "Vadonut", description: "Test" },
        "dishes", function (result) {
            console.log(result.ops);

            dboper.findDocuments(db, "dishes", function (docs) {
                console.log(docs);

                dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" },
                    "dishes", function (result) {
                        console.log(result.result);

                        dboper.findDocuments(db, "dishes", function (docs) {
                            console.log(docs)

                            db.dropCollection("dishes", function (result) {
                                console.log(result);

                                db.close();
                            });
                        });
                    });
            });
        });
});

// insertOneWriteOpResult
//     insertedCount 	Number 	The total amount of documents inserted.
//     ops 	Array.<object> 	All the documents inserted using insertOne/insertMany/replaceOne. Documents contain the _id field if forceServerObjectId == false for insertOne/insertMany
//     insertedId 	ObjectId 	The driver generated ObjectId for the insert operation.
//     connection 	object 	The connection object used for the operation.
//     result 	object 	The raw command result object returned from MongoDB (content might vary by server version).
//             ok 	Number 	Is 1 if the command executed correctly.
//             n 	Number 	The total count of documents inserted.
