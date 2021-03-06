const cssnano = require('cssnano');
const merge = require('webpack-merge');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
    new webpack.EnvironmentPlugin({
      PUBLIC_PATH: 'https://tuvi.phongthuytaivan.vn',
    }),
  ],
});
