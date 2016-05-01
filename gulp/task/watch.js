var gulp = require('gulp');
var watch = require('gulp-watch');
gulp.task('watch',['browserify'],function(){
	watch('./chat/js/**/*.js',function(){
		gulp.start('browserify');
	});
});
