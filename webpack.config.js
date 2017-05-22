var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './src/profilr.ts'
  ],
  output: {
    path: path.join(__dirname, 'generated'),
    filename: 'profilr.js',
    library: 'profilr',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [ /node_modules/ ],
        loaders: [ 'babel-loader', 'ts-loader' ]
      }
    ]
  },
  plugins: [
    require('webpack-fail-plugin')
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [ '.ts', '.js' ]
  }
};
