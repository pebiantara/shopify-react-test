const config = require('config');
const path = require('path');
const webpack = require('webpack');

let startProgress = null;
const progressHandler = (percentage) => {
  if (percentage === 0) {
    startProgress = new Date();
    console.info('Starting webpack build');
  }
  if (percentage === 1 && startProgress) {
    const endProgress = new Date();
    const seconds = (endProgress.getTime() - startProgress.getTime()) / 1000;
    console.info(`Finished webpack build - ${seconds.toFixed(2)}s`);
  }
};

const webpackCfg = {
  mode: 'production',
  devtool: false,
  watchOptions: {
    aggregateTimeout: 600,
    ignored: ['**/vendor/*', '**/node_modules'],
  },
  entry: {
    theme: './src/scripts/theme-main.js',
  },
  output: {
    filename: '[name].js',
    chunkFilename: 'chunk.[name].js?h=[contenthash]',
    path: path.resolve(__dirname, 'build/assets'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.js.liquid'],
    alias: {
      '~vendor': path.resolve(__dirname, './src/scripts/vendor'),
      '~mod': path.resolve(__dirname, './src/scripts/modules'),
      '~comp': path.resolve(__dirname, './src/scripts/components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|js.liquid)?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { babelrc: true },
        }],
      },
    ],
  },
  plugins: [new webpack.ProgressPlugin(progressHandler)],
};

if (config.debug) {
  webpackCfg.plugins.push(
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map?h=[contenthash]',
      exclude: ['**/vendor/*', /node_modules/],
    }),
  );
}

module.exports = webpackCfg;
