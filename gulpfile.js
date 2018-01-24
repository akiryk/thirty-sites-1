// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const htmlclean = require('gulp-htmlclean');
const livereload = require('gulp-livereload');
const newer = require('gulp-newer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const webserver = require('gulp-webserver');
const devBuild = true;

// HTML processing
gulp.task('html', function() {
  var
    page = gulp.src('src/*.html')
      .pipe(newer('docs/'));

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean());
  }

  return page
    .pipe(gulp.dest('docs/'))
    .pipe(livereload());
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
  ])
    .pipe(concat('vendors.js'))
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
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('docs/js/'))
    .pipe(livereload())
);

gulp.task('watch', ['webserver'], function() {
  livereload.listen();
  gulp.watch('src/js/**/*.js', ['babel']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', ['html'])
});

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['sass', 'babel', 'html', 'watch']);