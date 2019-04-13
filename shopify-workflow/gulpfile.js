const gulp     = require('gulp')

// Estilos
const sass     = require('gulp-sass')
const prefix   = require('gulp-autoprefixer')

// Scripts
const babel    = require('gulp-babel')
const concat   = require('gulp-concat');

// Imágenes
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')

// Otras
const merge    = require('merge-stream');

// src / dest
const input = 'sass/**/*.scss'
const output = '../assets/'


gulp.task('sass', () => {
  gulp.src(input)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(prefix({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(output))
})

gulp.task('scripts', () => {

  var babeljs = 
    gulp.src('js/*.js')
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(gulp.dest('js/babel/'));

  var concatjs = 
    gulp.src(['js/lib/*.js', 'js/babel/*.js'])
      .pipe(concat('scripts.all.js'))
      .pipe(gulp.dest(output));

  return merge(babeljs, concatjs);
})

gulp.task('imagemin', () => {
  gulp.src('img/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('assets/'))
})

gulp.task('default', () => {
  gulp.watch('sass/**/*.scss', ['sass'])
  gulp.watch('js/**/*.js', ['scripts'])
})