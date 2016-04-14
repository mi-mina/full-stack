var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del');

//jshint
gulp.task('jshint', function() { // 'jshint' is the name of the task
  return gulp.src('app/scripts/**/*.js') //all the js files in app/scripts are the source
  .pipe(jshint()) //We pipe them into the jshint() function
  .pipe(jshint.reporter(stylish)); //stylish is an option
});

// Clean
gulp.task('clean', function() {
    return del(['dist']); //del is a node module
});

// Default task
gulp.task('default', ['clean'], function() { //the clean task must be run before default
    gulp.start('usemin', 'imagemin','copyfonts'); //This functions will be run synchronously
                                                  // They don't depend on each other
    //gulp.start('usemin', 'imagemin','copyfonts', 'copytemplates');//

});

//usemin
gulp.task('usemin',['jshint'], function () { //the jshint task must be run before usemin
   return gulp.src('./app/**/*.html') //Find all html files in the app directory, including index.html,
                                      //the file where the comments build and endbuild are.
    //return gulp.src('./app/index.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()] //ngannotate avoids problems
      }))
      .pipe(gulp.dest('dist/'))
      .pipe(gulp.dest('../json-server/public'));//I have added this in order not to copy
      //the content in the dist directory to the public directory every time the code changes
});

// Images
gulp.task('imagemin', function() {
  return del(['dist/images']),
  gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(gulp.dest('../json-server/public/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

//copyfonts
gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'))
   .pipe(gulp.dest('../json-server/public/fonts'));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'))
   .pipe(gulp.dest('../json-server/public/fonts'));
});

//copytemplates
//Esto lo incluí de un comentario del foro.
//Ahora no hace falta porque ya he modificado el usemin task para que lo incluya
// gulp.task('copytemplates', ['clean'], function(){
//     gulp.src(['app/views/*.html'])
//     .pipe(gulp.dest('dist/views'));
// });

// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
  // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);
});

//BrowserSync.
// It's a Node module, not a Gulp module. It serves static web folder
// There is also a connect package for Gulp.
gulp.task('browser-sync', ['default'], function () {
  var files = [ //These are the files that are kept watched
    'app/**/*.html',
    'app/styles/**/*.css',
    'app/images/**/*.png',
    'app/scripts/**/*.js',
    'dist/**/*'];

  browserSync.init(files, {
    server: {
      baseDir: "dist",
      index: "index.html"
    }
  });
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});
