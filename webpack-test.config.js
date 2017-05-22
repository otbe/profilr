var conf = require('./webpack.config');
var path = require('path');

conf.devtool = 'inline-source-map';

delete conf.entry;
conf.externals = {
  'fs': 'commonjs fs',
  'expect': 'commonjs expect',
  'babel-polyfill': 'commonjs babel-polyfill'
};

conf.entry = [
  './tests/index.js'
];

conf.module.loaders.push(
  {
    test: /\.js$/,
    exclude: [ /node_modules/ ],
    loaders: [ 'babel-loader' ]
  }
);


conf.output = {
  path: path.join(__dirname, 'generated'),
  devtoolModuleFilenameTemplate: './[resource-path]',
  filename: 'tests.js',

};

module.exports = conf;
