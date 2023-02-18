const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const { series, watch } = require("gulp");

// Define paths for styles, scripts, and HTML
const paths = {
  styles: {
    src: "assets/sass/**/*.scss",
    dest: "public/css",
  },
  scripts: {
    src: "assets/js/**/*",
    dest: "public/js",
  },
  html: {
    src: "public/**/*.html",
  },
};

// Task to compile SCSS files to CSS and autoprefix it
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
      })
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Task to reload the browser when HTML, CSS, or JS files change
function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}

// Task to watch HTML, CSS, and JS files for changes and run appropriate tasks
function watchFiles() {
  // Initialize the browser-sync server
  browserSync.init({
    server: {
      baseDir: "./public",
    },
  });

  // Watch for changes in SCSS files and run the styles task
  watch(paths.styles.src, styles);

  // Watch for changes in JS files and reload the browser
  watch(paths.scripts.src, series(reloadBrowser));

  // Watch for changes in HTML files and reload the browser
  watch(paths.html.src, series(reloadBrowser));
}

// Expose tasks
exports.watch = watchFiles; // The watch task to start the server and watch files for changes
exports.default = series(styles); // The default task to compile styles and exit
