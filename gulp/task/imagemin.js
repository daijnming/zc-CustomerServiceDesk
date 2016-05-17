/**
 * @author Treagzhao
 */
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('imagemin', function() {
    return gulp.src(['./chat/img/**/*.jpeg','./chat/img/**/*.jpg','./chat/img/**/*.gif','./chat/img/**/*.png']).
    //pipe(imagemin()).
    pipe(gulp.dest('./dest/img/'));
});
