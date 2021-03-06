const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const webp = require("gulp-webp");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const svgstore = require("gulp-svgstore");
const imagemin = require("gulp-imagemin");
const sync = require("browser-sync").create();

//Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
}

exports.images = images;

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
}

exports.html = html;

//Scripts
const scripts = () => {
  return gulp.src("source/js/script.js")
  .pipe(gulp.dest("build/js"))
  .pipe(sync.stream());
}

exports.scripts = scripts;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.ttf",
    "source/*.ico",
    "source/img/*{jpg,png,svg}"
  ],{
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, sync.reload));
}

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles, html, copy, scripts
  ),
  gulp.series(
    server, watcher
  )
)

//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles, html, copy, images, scripts
  )
)

exports.build = build;
