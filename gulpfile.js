// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');


// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('docs/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
            'src/js/vendors/gsap/TweenMax.min.js',
            'src/js/vendors/ScrollMagic/ScrollMagic.min.js',
            'src/js/vendors/ScrollMagic/animation.gsap.min.js',
            'src/js/main.js'
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('docs'))
        .pipe(rename('all.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('docs/js'));
});

gulp.task('webserver', function() {
  gulp.src('docs')
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 8000,
    }));
});

// Watch Files For Changes
gulp.task('watch', ['webserver'], function() {
    livereload.listen();
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);