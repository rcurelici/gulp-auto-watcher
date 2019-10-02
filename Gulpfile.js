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

const PROXY_LOCALHOST = 'localhost:5000'

//tasks  production-------------------------------
gulp.task('hello', (done) => {
    console.log('hello from gulp task')
    done()
})

gulp.task('clean:dist', () => {
    return del(['dist'])
})

gulp.task('scripts', () => {
    return gulp.src('src/**/*.js')
    .pipe(concat('main.min.js'))
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
gulp.task('watcher', (done) => {
    gulp.watch('src/**/*.js', gulp.parallel(
        gulp.series('tests', 'scripts')
    ))
    gulp.watch('public/styles/**/*.less', gulp.parallel('styles'))
    gulp.watch('./dev/**/*', bsync.reload)
    done()
})
// end production tasks ---------------------------------
//tasks development--------------------------------------
gulp.task('scripts-dev', () => {
//    return gulp.src('src/**/.*js')
})
gulp.task('styles-dev',()=> {
    return gulp.src('./public/styles/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dev/styles/css'))
})
gulp.task('watcher-dev',(done)=>{
    gulp.watch('./src/**/*.js',gulp.parallel('tests'))
    gulp.watch('./public/styles/**/*.less', gulp.parallel('styles-dev'))
    //reload browser if there are cheanges in dev folders
    gulp.watch('./dev/**/*').on('change', bsync.reload) 
    gulp.watch('./views/**/*.ejs').on('change', bsync.reload)
    done()
})
// end development tasks----------------------------------

gulp.task('tests', () => {
    return gulp.src('src/**/*.js')
    .pipe(jshint({esversion: '6', asi: true}))       //options: 1)enable ES6, 2) remove semicolumn errors
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
})

//create a local server 
gulp.task('server',(done) =>{
    bsync.init({
        proxy: PROXY_LOCALHOST
    })
    done()
})

//---------------------------------------------------------------

//use for production
gulp.task('default',
    gulp.series('clean:dist',
        gulp.parallel('styles',
            gulp.series('tests','scripts')
        )
        ,'server'
        ,'watcher'
    )
)
//use for dev
gulp.task('test-dev',
    gulp.series(gulp.parallel('tests','styles-dev'), 'server', 'watcher-dev')
)

