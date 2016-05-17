/**
 * @author Treagzhao
 */
var gulp = require("gulp");
var useref = require("gulp-useref");
var gulpIf = require("gulp-if");
var uglify = require('gulp-uglify');
var minifyCss = require("gulp-minify-css");
var autoPrefixed = require("gulp-autoprefixer");
gulp.task('useref',['browserify'], function() {
    gulp.src('chat/chat.html').
    pipe(useref()).
    pipe(gulpIf("*.css",minifyCss())).
    pipe(gulpIf("*.css",autoPrefixed())).
    pipe(gulpIf("*.js",uglify())).
    pipe(gulp.dest('./dest/'));
});
