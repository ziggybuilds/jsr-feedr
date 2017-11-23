const gulp = require("gulp"),
  concat = require("gulp-concat"),
  gutil = require("gulp-util"),
  browserSync = require("browser-sync").create(),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  babel = require("gulp-babel");

// flag errors
gulp.task("log", function() {
  gutil.log("== My Log Task ==");
});

gulp.task("js", function() {
  return gulp
    .src(["./src/**/*.js"])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("app.js"))
    .pipe(gulp.dest("./js/"));
});

gulp.task("watch", function() {
  gulp.watch("./src/*.js", ["js"]);
});

// Setup browser sync

// browser-sync watched files
// automatically reloads the page when files changed
var browserSyncFiles = ["./styles/style.css", "./src/script.js"];
// browser-sync options
// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
  proxy: "http://localhost:8080/",
  notify: false,
  injectChanges: true,
  reloadOnRestart: true
};

// Browser sync
gulp.task("sync", function() {
  browserSync.init(browserSyncFiles, browserSyncOptions);
});

gulp.task("run", ["sync", "watch"]);
