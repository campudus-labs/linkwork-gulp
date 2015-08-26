var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var through2 = require('through2');

gulp.task('browser-sync', ['watch'], function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({
    server : {
      baseDir : 'out'
    },
    open : false
  });
});

gulp.task('sass', function () {
  return gulp.src('web/scss/style.scss')
    .pipe(plumber({
      errorHandler : function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    //Example of a self written transform/duplex stream (just logging out the scss)
    .pipe(through2.obj(function (chunk, enc, callback) {
      console.log(chunk.contents.toString(enc), enc);
      this.push(chunk);
      callback();
    }))
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest('out/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['assetCopy', 'sass', 'js'], function () {
  gulp.watch('web/scss/*.scss', ['sass']);
  gulp.watch(['web/**/*', '!web/scss/', '!web/scss/**', '!web/js/', '!web/js/**'], ['reloadAssets']);
  gulp.watch(['web/js/**/*.js'], ['reloadJs']);
});

gulp.task('reloadJs', ['js'], browserSync.reload);
gulp.task('js', function () {
  return gulp.src('web/js/**/*.js')
    .pipe(plumber({
      errorHandler : function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('out/js/'));
});

gulp.task('reloadAssets', ['assetCopy'], browserSync.reload);
gulp.task('assetCopy', function () {
  return gulp.src(['./web/**/*', '!./web/scss/**', '!./web/js/**'])
    .pipe(gulp.dest('./out'));
});

gulp.task('clean', function (done) {
  del('out', done);
});

gulp.task('default', ['browser-sync']);