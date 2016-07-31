var path = require('path');


const ROOT_DIR = path.resolve(__filename, '../');

module.exports = {
  context: ROOT_DIR,
  devtool: 'cheap-module-source-map',
  entry: ['./app.js'],
  output: {
    path: './build',
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
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
};
