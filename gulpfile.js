"use strict";

const clip = require("gulp-clip-empty-files"),
  cp = require("child_process"),
  del = require("del"),
  fs = require("fs"),
  gulp = require("gulp"),
  named = require("vinyl-named"),
  pug = require("gulp-pug"),
  path = require("path"),
  sass = require("gulp-sass")(require("node-sass")),
  sassTypes = require("node-sass").types,
  webpack = require("webpack-stream"),
  uglify = require("gulp-uglify"),
  util = require("gulp-util");
const DEST = "./app";
const TEST_URL = "http://localhost:9876/all";
const IS_DEV = process.env.NODE_ENV === "development";

// based on https://coderwall.com/p/fhgu_q/inlining-images-with-gulp-sass
function sassInlineImage(file) {
  var filePath = path.resolve(process.cwd(), file.getValue()),
    ext = filePath.split(".").pop(),
    data = fs.readFileSync(filePath),
    buffer = Buffer.from(data),
    str = '"data:image/' + ext + ";base64," + buffer.toString("base64") + '"';
  return sassTypes.String(str);
}

const webpackConfig = {
  mode: IS_DEV ? "development" : "production",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: __dirname + "/convert-logs?" + (IS_DEV ? "dev" : ""),
      },
    ],
  },
};

gulp.task("js", function () {
  return gulp
    .src("./src/*.js")
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe(IS_DEV ? util.noop() : uglify())
    .pipe(gulp.dest(DEST));
});

gulp.task("sass", function () {
  return gulp
    .src("./src/*.sass")
    .pipe(
      sass({
        functions: {
          "inline-image($file)": sassInlineImage,
        },
      })
    )
    .pipe(clip())
    .pipe(gulp.dest(DEST));
});

gulp.task("pug", function () {
  return gulp.src("./src/*.pug").pipe(pug()).pipe(gulp.dest(DEST));
});

gulp.task("copy", function () {
  return gulp.src("./src/*.{png,css,json,svg}").pipe(gulp.dest(DEST));
});

gulp.task("clean", function (done) {
  del.sync(DEST);
  done();
});

gulp.task("zip", function (done) {
  const m = require("./src/manifest.json"),
    fn = "copytables_" + m.version.replace(/\./g, "_") + ".zip";

  cp.execSync(`rm -f ./${fn} && zip -j ./${fn} ./app/*`);
  done();
});

gulp.task("make", gulp.series("clean", "pug", "sass", "copy", "js"));

gulp.task("watch", function () {
  gulp.watch("./src/**/*", gulp.series("make"));
});

gulp.task("deploy", gulp.series("make", "zip"));
