var gulp = require('gulp');
var ts = require('gulp-typescript');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var strip = require('gulp-strip-comments');
var merge = require('merge-stream');

var tsCjsProject = ts.createProject('tsconfig.json', { module: 'commonjs' });
var tsMjsProject = ts.createProject('tsconfig.json', { module: 'esnext' });

gulp.task('default', function () {
  const source = gulp.src(['src/!(*.spec).ts', 'src/!(*.spec).tsx'])
    .pipe(sourcemaps.init())
  const mjs = source
    .pipe(tsMjsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(rename(path => {
      if (path.extname === '.js') {
        path.extname = ".mjs"
      }
    }))
    .pipe(strip())
    .pipe(gulp.dest('build/es'));

  const cjs = source
    .pipe(tsCjsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(strip())
    .pipe(gulp.dest('build/cjs'));


  return merge(mjs, cjs);
});