'use strict';

module.exports = function (grunt) {
  // This sets up the Grunt module ready for including the grunt tasks inside
  // the function above.

  // We first do the requirements**************
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

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
    },
    // Beware of the comma between configurations

    useminPrepare: {
        html: 'app/menu.html',
        // It will look in the menu.html and al the files thar are between the
        //  <!-- build:css styles/main.css --> and <!-- endbuid --> will be concatenated
        // minified, etc...
        // the same with what's between <!-- build:js scripts/main.js -->
        options: {
            dest: 'dist'
        }
    },
      // Concat
    concat: {
        options: {
            separator: ';'
        },
        // dist configuration is provided by useminPrepare
        dist: {}
    },
      // Uglify
    uglify: {
        // dist configuration is provided by useminPrepare
        dist: {}
    },
    cssmin: {
        dist: {}
    },
      // Filerev
    filerev: {
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 20
        },
        release: {
            // filerev:release hashes(md5) all assets (images, js and css )
            // in dist directory
            files: [{
                src: [
                    'dist/scripts/*.js',
                    'dist/styles/*.css',
                ]
            }]
        }
    },
      // Usemin
      // Replaces all assets with their revved version in html and css files.
      // options.assetDirs contains the directories for finding the assets
      // according to their relative paths
    usemin: {
        html: ['dist/*.html'],
        css: ['dist/styles/*.css'],
        options: {
            assetsDirs: ['dist', 'dist/styles']
        }
    },

    copy: {
      dist: {
        cwd: 'app',
        // Current Working Directory
        src: [ '**','!styles/**/*.css','!scripts/**/*.js' ],
        // Copy everything but the css files in the styles folder and the .js
        // files un the scripts folder
        dest: 'dist',
        // Destination folder
        expand: true
      },
      fonts: {
          files:[
              {
                  //for bootstrap fonts
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }, {
                    //for font-awesome
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/font-awesome',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }
          ]
        }
    },
    watch: {
        copy: {
            files: [ 'app/**', '!app/**/*.css', '!app/**/*.js'],
            tasks: [ 'build' ]
        },
        scripts: {
            files: ['app/scripts/app.js'],
            tasks:[ 'build']
        },
        styles: {
            files: ['app/styles/mystyles.css'],
            tasks:['build']
        },
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
                'app/{,*/}*.html',
                '.tmp/styles/{,*/}*.css',
                'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      dist: {
        options: {
          open: true,
          base:{
               path: 'dist',
            options: {
                index: 'menu.html',
                maxAge: 300000
            }
          }
        }
      }
    },
    clean: {
        build:{
            src: [ 'dist/']
            // Clean all in the dist folder
        }
    }


  });

  // We register tasks here ******************************
  grunt.registerTask('build', [
      'clean',
      'jshint',
      'useminPrepare',
      'concat',
      'cssmin',
      'uglify',
      'copy',
      'filerev',
      'usemin'
    ]);
  grunt.registerTask('serve',['build','connect:dist','watch']);
  grunt.registerTask('default',['build']);
  // If we simple type grunt at the command line, jshint will run

};
