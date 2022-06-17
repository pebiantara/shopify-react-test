const srcDir = 'src';

const theme = [`${srcDir}/theme/**/*.liquid`, `${srcDir}/theme/**/*.json`];
const scss = [
  `${srcDir}/scss/*.css`,
  `${srcDir}/scss/*.scss`,
];

const styles = [
  `${srcDir}/styles/**/*.scss.liquid`,
  `${srcDir}/styles/**/*.css`,
  `${srcDir}/styles/**/*.css.liquid`,
];

const vendorScripts = [
  `${srcDir}/scripts/vendor/*.js`,
  `${srcDir}/scripts/vendor/*.js.liquid`,
];

const assets = [`${srcDir}/assets/**/*`, `${srcDir}/fonts/**/*`];

module.exports = {
  theme,
  styles,
  vendorScripts,
  assets,
  scss,
};
