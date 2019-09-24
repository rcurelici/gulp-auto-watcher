const gulp = require('gulp')
const del = require('del')

//plugins gulp
const concat = require('gulp-concat')
const terser = require('gulp-terser')       //al posto di uglify, accetta ES6
const less = require('gulp-less')
const minifyCss = require('gulp-cssnano')
const prefix = require('gulp-autoprefixer')
const jshint = require('gulp-jshint')

//tasks
gulp.task('hello', (done) => {
    console.log('hello from gulp task')
    done()
})

gulp.task('clean:dist', () => {
    return del(['dist'])
})

gulp.task('scripts', () => {
    return gulp.src('src/**/*.js')
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('styles', () => {
    return gulp.src('public/styles/**/*.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(prefix())
    .pipe(gulp.dest('dist/public/styles'))
})

gulp.task('tests', () => {
    return gulp.src('src/**/*.js')
    .pipe(jshint())       //opzioni: 1)abilita ES6, 2) rimuovi errore per semicolon
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('default',() => {
    //todo
})
