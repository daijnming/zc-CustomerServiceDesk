/**
 * @author Treagzhao
 */
var gulp = require("gulp");
var useref = require("gulp-useref");
var gulpIf = require("gulp-if");
var uglify = require('gulp-uglify');
var minifyCss = require("gulp-minify-css");
var autoPrefixed = require("gulp-autoprefixer");

gulp.task('move-file',function(){
	return gulp.src('./chat/**/*.mp3').
	pipe(gulp.dest('./dist'));
});


gulp.task('useref',['browserify','move-file'], function() {
   return gulp.src('chat/chat.html').
    pipe(useref()).
    pipe(gulpIf("*.css",minifyCss())).
    pipe(gulpIf("*.css",autoPrefixed())).
    pipe(gulpIf("*.js",uglify())).
    pipe(gulp.dest('./dest/'));
});
