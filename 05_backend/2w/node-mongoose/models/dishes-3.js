var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    require: true
  },
  author: {
    type: String,
    required: true
  }
},{
  timestamps: true
});

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
    },
    comments: [commentSchema]
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
