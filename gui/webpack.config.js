const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');


const ROOT_DIR = path.resolve(__filename, '..');

module.exports = {
  context: ROOT_DIR,
  devtool: 'cheap-module-source-map',
  entry: ['./app.js'],
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'source-map'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new CopyWebpackPlugin([
      {from: './images/default_avatar.svg'}
    ])
  ],
  postcss: () => {
    return [
      require('postcss-import'),
      require('postcss-sassy-mixins'),
      require('postcss-nested'),
      require('postcss-advanced-variables')
    ]
  }
};
