#!/usr/bin/env bash
set -e

rm -rf coverage
mkdir coverage

./node_modules/.bin/webpack --config webpack-test.config.js

