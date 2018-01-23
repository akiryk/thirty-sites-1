// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const webserver = require('gulp-webserver');


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
gulp.task('scripts', () =>
  gulp.src([
    'src/js/vendors/gsap/TweenMax.min.js',
    'src/js/vendors/ScrollMagic/ScrollMagic.min.js',
    'src/js/vendors/ScrollMagic/animation.gsap.min.js',
    'docs/js/main.js'
  ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('docs'))
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('docs/js'))
);

gulp.task('webserver', () =>
  gulp.src('docs')
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 8000,
    }))
);

gulp.task('babel', () =>
  gulp.src('src/js/main.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('docs/js'))
);

// Watch Files For Changes
gulp.task('watch', ['webserver'], function() {
  livereload.listen();
  gulp.watch('src/js/main.js', ['babel']);
  gulp.watch('src/js/*.js', ['lint', 'scripts']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);