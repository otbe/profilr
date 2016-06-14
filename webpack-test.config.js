var conf = require('./webpack.config');

conf.devtool = 'inline-source-map';

delete conf.entry;
conf.externals = {
  'fs': 'commonjs fs',
  'expect': 'commonjs expect',
  'babel-polyfill': 'commonjs babel-polyfill'
};

conf.ts = {
  compilerOptions: {
    declaration: false
  }
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
  path: './generated',
  devtoolModuleFilenameTemplate: './[resource-path]',
  filename: 'tests.js',

};

module.exports = conf;
