var gulp = require("gulp");
var browserify = require('gulp-browserify');
var config = require('../config.json');
gulp.task('browserify',function(){
	gulp.src(config.baseDir+'js/**/entrance.js').
	pipe(browserify({
		'insertGlobals':false
	})).
	pipe(gulp.dest(config.baseDir+'dest/js'));
});
