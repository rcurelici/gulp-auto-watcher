const gulp = require('gulp')
const del = require('del')
const bsync = require('browser-sync')

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
    .pipe(jshint({esversion: '6', asi: true}))       //opzioni: 1)abilita ES6, 2) rimuovi errore per semicolon
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
})

//crea 1 server locale 
gulp.task('server',(done) =>{
    bsync.init({
        server:{
            baseDir: './'
        }
    })
    done()
})

gulp.task('watcher', (done) => {
    gulp.watch('src/**/*.js', gulp.parallel(
        gulp.series('tests', 'scripts')
    ))
    gulp.watch('public/styles/**/*.less', gulp.parallel('styles'))
    gulp.watch('dist/**/*', bsync.reload)
    done()
})

gulp.task('default',
    gulp.series('clean:dist',
        gulp.parallel('styles',
            gulp.series('tests','scripts')
        )
        ,'server'
        ,'watcher'
    )
)
