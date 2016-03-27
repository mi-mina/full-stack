'use strict';

module.exports = function (grunt) {
  // This sets up the Grunt module ready for including the grunt tasks inside
  // the function above.

  // We first do the requirements**************
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt);

  // We do the tasks configurations here****************
  grunt.initConfig({
    // Most Grunt tasks rely on configuration data defined in an object
    // passed to the grunt.initConfig method.
    pkg: grunt.file.readJSON('package.json'),
    // Imports the JSON metadata stored in package.json into the grunt config.

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        // json file that contains some configuration information
        reporter: require('jshint-stylish')
        // To require the jshint-stylish module
      },
      all: {
        // contains the source property which specifies all the js files that we
        // are going to ask jshint to check
        src: [
          'Gruntfile.js',
          'app/scripts/{,*/}*.js'
          // Anything in the app/scripts directory
        ]
      }
    }

  });

  // We register tasks here ******************************
  grunt.registerTask('build', [
      'jshint'
    ]);

  grunt.registerTask('default',['build']);
  // If we simple type grunt at the command line, jshint will run 

};
