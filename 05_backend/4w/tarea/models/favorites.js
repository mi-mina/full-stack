var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// probar a sacar los que está dentro del array de dishes como un schema a parte
// a ver si así al hacer un get muestra todos los platos y no solo uno. 

var favoriteSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dishes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    }]
  },
  {
    timestamps: true
  }
);

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
