require('babel-polyfill');

var testsContext = require.context(".", true, /\.(ts|js)$/);
testsContext.keys().forEach(testsContext);
