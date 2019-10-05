var clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    csslint = require('gulp-csslint'),
    eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    headerfooter = require('gulp-headerfooter'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    validator = require("gulp-html"),
    beautify = require('gulp-beautify'),
    paths = {
        source: {
            partials: './src/html/pages/*.html',
            header: './src/html/header.html',
            footer: './src/html/footer.html',
            js: './src/js/*.js',
            css: './src/css/*.css'
        },

        build: {
            html: './build/html',
            js: './build/js',
            css: './build/css'
        },

        target: {
            html: './public',
            js: './public',
            css: './public'
        }
    },
    beautify_options = {
            "indent_size": 4
        };


gulp.task('html', function() {
    return gulp.src(paths.source.partials)
        .on('error', logError)
        .pipe(headerfooter.header(paths.source.header))
        .pipe(headerfooter.footer(paths.source.footer))
        .pipe(beautify.html())
        .pipe(gulp.dest(paths.target.html))
        .pipe(connect.reload())
});

gulp.task('js', function() {
    return gulp.src(paths.source.js)
        .on('error', logError)
        .pipe(concat('app.js'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(beautify.js(beautify_options))
        .pipe(gulp.dest(paths.target.js))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    return gulp.src(paths.source.css)
        .on('error', logError)
        .pipe(concat('style.css'))
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(beautify.css())
        .pipe(gulp.dest(paths.target.css))
        .pipe(connect.reload())
});

gulp.task('watch', gulp.parallel(
    function() {
        return gulp.watch([
            paths.source.partials,
            paths.source.header,
            paths.source.footer
        ], gulp.series('html'))
    },

    function() {
        return gulp.watch([
            paths.source.css
        ], gulp.series('css'))
    },

    function() {
        return gulp.watch([
            paths.source.js
        ], gulp.series('js'))
    },

));

gulp.task('clean', function() {
    return gulp.src([
            paths.build.html,
            paths.build.js + '/*.js',
            paths.build.css + '/*.css',

            paths.target.html + '/*.html',
            paths.target.js + '/*.js',
            paths.target.css + '/*.css',

        ])
        .pipe(clean());
});

gulp.task('serve', function() {
    connect.server({
        root: paths.target.html,
        livereload: true
    });
});

gulp.task('build', gulp.parallel('html', 'js', 'css'));
gulp.task('default', gulp.parallel('build', 'watch', 'serve'));

var logError = function(error) {
    console.log(error.toString());
    this.emit('end');
};
