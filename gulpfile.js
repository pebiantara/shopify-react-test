/* eslint-disable no-console */
const config = require('config');
const {
  src, dest, watch, parallel, task, series, lastRun,
} = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const replace = require('gulp-replace');
const cleancss = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));

const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const files = require('./files');

const srcDir = 'src';
const buildDir = 'build';
const assetsDir = `${buildDir}/assets`;

function removeAssetsFile(filepath) {
  const folders = [
    `${srcDir}/scripts`,
    `${srcDir}/styles`,
    `${srcDir}/assets`,
    `${srcDir}/images`,
    `${srcDir}/fonts`,
  ].join('|');
  let names = filepath.replace(new RegExp(folders), '').split('.');
  if (names.length > 3 && names.slice(-2, -1) === 'liquid') {
    names = names.slice(0, -1);
  }
  const filename = names.join('.');
  console.log(`Removing ${assetsDir}${filename}`);
  del.sync(`${assetsDir}${filename}`);
}

function removeThemeFile(filepath) {
  let filename = filepath.replace(new RegExp(`${srcDir}/theme/`), '');
  if (filename.includes('snippets')) {
    const [dir, ...others] = filename.split('/');
    filename = `${dir}/${others.join('__')}`;
  }
  console.log(`Removing ${buildDir}/${filename}`);
  del.sync(`${buildDir}/${filename}`);
}

const themeFiles = function () {
  return src(files.theme, { since: lastRun(themeFiles) })
    .pipe(rename((f) => {
      if (f.dirname.includes('snippets')) {
        const [dir, ...dirs] = f.dirname.includes('/') ? f.dirname.split('/') : f.dirname.split('\\');
        if (dirs.length > 0) {
          // eslint-disable-next-line no-param-reassign
          f.dirname = dir;
          // eslint-disable-next-line no-param-reassign
          f.basename = `${dirs.join('__')}__${f.basename}`;
        }
      }
    }))
    .pipe(dest(buildDir));
};

const scssFiles = function () {
	return src(files.scss)
    .pipe(sass({
      outputStyle: config.debug ? 'expanded' : 'compressed'
    }))
		.pipe(autoprefixer())
		.pipe(rename({ extname: '.css.liquid' }))
		.pipe(replace('"{{', '{{'))
		.pipe(replace('}}"', '}}'))
		.pipe(dest(assetsDir));
};

const assetFiles = function () {
  return src(files.assets, { since: lastRun(assetFiles) })
    .pipe(dest(assetsDir));
};

const styleFiles = function () {
  return src(files.styles, { since: lastRun(styleFiles) })
    .pipe(cleancss())
    .pipe(dest(assetsDir));
};

const minScriptFiles = function () {
  return src(files.vendorScripts, { since: lastRun(minScriptFiles) })
    .pipe(dest(assetsDir));
};

const webpackBuild = (isWatch = false) => () => new Promise((resolve, reject) => {
  webpack({ ...webpackConfig, watch: isWatch }, (err, stats) => {
    if (err) {
      return reject(err);
    }
    if (stats.hasErrors()) {
      return reject(new Error(stats.compilation.errors.join('\n')));
    }
    return resolve();
  });
});

const watchFiles = function (done) {
  watch(files.theme, themeFiles).on('unlink', removeThemeFile);
  watch(files.assets, assetFiles).on('unlink', removeAssetsFile);
  watch(files.styles, styleFiles).on('unlink', removeAssetsFile);
  watch(files.scss, scssFiles);
  watch(files.vendorScripts, minScriptFiles).on('unlink', removeAssetsFile);
  done();
};

const clean = () => del([buildDir]);

const buildTasks = [
  themeFiles,
  assetFiles,
  styleFiles,
  scssFiles,
  minScriptFiles,
];

task(clean);
task(themeFiles);
task('webpack', webpackBuild());
task('webpackWatch', webpackBuild(true));
task(
  'build',
  parallel(...buildTasks, 'webpack'),
);
task('watch', series(
  parallel(...buildTasks, 'webpackWatch'),
  watchFiles,
));
task('default', series('clean', 'watch'));
