const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const { spawn } = require('child_process');
const merge = require('merge-stream'); // You might need to install this package

// Compile SCSS files to CSS
function compileSass() {
    return gulp.src('popup/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/popup'));
}

// Copy HTML files from popup to dist/popup
function copyHtml() {
    return gulp.src('popup/*.html')
        .pipe(gulp.dest('dist/popup'));
}

// Copy Images and Manifest
function copyStatic() {
    const copyImages = gulp.src('images/*')
        .pipe(gulp.dest('dist/images'));

    const copyManifest = gulp.src('manifest.json')
        .pipe(gulp.dest('dist/'));

    return merge(copyImages, copyManifest);
}

// Watch files for changes
function watchFiles() {
    gulp.watch('popup/*.scss', compileSass);
    gulp.watch('popup/*.html', copyHtml);
    gulp.watch(['images/*', 'manifest.json'], copyStatic);
}

// TypeScript watch task
function tscWatch(cb) {
    const tsc = spawn('tsc', ['--watch'], { stdio: 'inherit' });
    tsc.on('close', () => cb());
}

// Default task
gulp.task('default', gulp.parallel(compileSass, copyHtml, copyStatic, watchFiles, tscWatch));
