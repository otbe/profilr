#!/usr/bin/env bash
set -e

./node_modules/.bin/istanbul cover _mocha generated/tests.js --print none --report json
mv coverage/coverage.json generated/coverage.json
./node_modules/.bin/remap-istanbul -i generated/coverage.json > coverage/coverage.json
