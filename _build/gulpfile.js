/* File: gulpfile.js */

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
//var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');

var source = {
  sass: ['../_src/scss/*.scss'],
  javascript: ['node_modules/foundation-sites/js/foundation.core.js','../_src/js/*.js']
};

var destination = {
  stylesheets: '../assets/css/',
  javascript: '../assets/js/',
  css_combined: 'combined.css',
  js_combined: 'combined.js'
};


// Gulp restart when gulpfile is changed
var spawn = require('child_process').spawn;

gulp.task('gulp-autoreload', function() {
  // Store current process if any
  var p;

  gulp.watch('gulpfile.js', spawnChildren);
  // Comment the line below if you start your server by yourslef anywhere else
  spawnChildren();

  function spawnChildren(e) {
    if(p) {
        p.kill();
    }

    p = spawn('gulp', ['build'], {stdio: 'inherit'});
  }
});


// create a default task and just log a message
// gulp.task('default', function() {
//   return gutil.log('Gulp is running!')
// });

// gulp.task('browser-sync', function() {
//   browserSync({
//     server: {
//        baseDir: "./"
//     }
//   });
// });
//
// gulp.task('bs-reload', function () {
//   browserSync.reload();
// });

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});



gulp.task('styles', function(){
  gulp.src(source.sass)
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(concat(destination.css_combined))
    .pipe(cleanCSS(destination.css_combined))
    .pipe(gulp.dest(destination.stylesheets))
    // .pipe(browserSync.reload({stream:true}))
});



gulp.task('scripts', function(){
  return gulp.src(source.javascript)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destination.javascript))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(destination.javascript))
    //.pipe(browserSync.reload({stream:true}))

});

// gulp.task('default', ['browser-sync'], function(){
//   gulp.watch(source.sass_files, ['styles']);
//   gulp.watch("src/scripts/**/*.js", ['scripts']);
//   gulp.watch("*.html", ['bs-reload']);
// });

gulp.task('watch', function() {
  gulp.watch(source.sass, ['styles']);
  gulp.watch(source.javascript, ['scripts']);
  gulp.watch('gulpfile.js', [ 'gulp-autoreload' ]);
});

gulp.task('build', function() {
  gulp.start('styles');
  gulp.start('scripts');
});

gulp.task('default', ['build','watch']);
