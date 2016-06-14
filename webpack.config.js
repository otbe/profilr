var webpack = require('webpack');

module.exports = {
  entry: [
    './src/profilr.ts'
  ],
  output: {
    path: './generated',
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
    extensions: [ '', '.ts', '.js' ],
    modulesDirectories: [ 'node_modules' ]
  }
};
