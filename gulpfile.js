"use strict"

const pump = require('pump');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const tinypng = require('gulp-tinypng');
const autoprefix = require('gulp-autoprefixer');
 
gulp.task('compress', function (cb) {
  pump([
        gulp.src('./dist/assets/js/**/*.js'),
        uglify(),
        gulp.dest('./dist/assets/js')
    ],
    cb
  );
});

gulp.task("sass", function () {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(autoprefix({
			browsers: ['last 2 versions'],
            cascade: false
		}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./dist/assets/css'));
});

gulp.task("js", function () {
	return gulp.src('./src/js/**/*.js')
		.pipe(babel({
			presets: ['env', 'react']
		}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dist/assets/js'));
});

gulp.task("img", function () {
	return gulp.src('./src/images/**/*.jpg')
		.pipe(tinypng('pq30rinq_UbtmqacchG8DQnw-hlYVcgM'))
		.pipe(gulp.dest('./dist/assets/images'));
});

gulp.task("watch", function () {
	gulp.watch('./src/scss/**/*.scss', ['sass']);
	gulp.watch('./src/js/**/*.js', ['js']);
});