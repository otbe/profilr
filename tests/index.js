/// <reference path="../typings/index.d.ts" />
require('babel-polyfill');

var testsContext = require.context(".", true, /\.(ts|js)$/);
testsContext.keys().forEach(testsContext);
