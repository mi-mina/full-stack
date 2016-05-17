var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a Schema
var dishSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// The schema is useless so far
// We need to create a model using it
var Dishes = mongoose.model('Dish', dishSchema);

// make this available to our Node applications
module.exports = Dishes;


// connection.model(name, [schema], [collection])
// When no collection argument is passed, Mongoose produces a
// collection name by passing the model name to the utils.toCollectionName
// method. This method pluralizes the name. If you don't like this behavior,
 // either pass a collection name or set your schemas collection name
 // option.
