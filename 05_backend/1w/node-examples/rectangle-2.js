module.exports = function (x, y, callback) {
  try{
    if(x < 0 || y < 0){
      throw new Error ("Rectangle dimensions should be greater than zero");
    }else{
      callback(null, {
        perimeter: function () {
          return (2*(x+y));
        },
        area: function () {
          return (x*y);
        }
      });
    }
  }
  catch (error) {
    callback(error, null);
  }
}

// The callback function takes 2 arguments, the first is the error.
// In this case we don't need to pass any arguments to the the perimeter and
// the area functions, because we already passed them to the top function.
// We are using closures here. The internal functions have acces to the parameters
// of the outer function, even after the outer function has exited.
