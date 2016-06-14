#!/usr/bin/env bash
set -e

rm -rf dist generated
mkdir dist generated

./node_modules/.bin/webpack

cp generated/profilr.js dist/profilr.js

find generated/ | grep '.d.ts' | xargs awk 'BEGINFILE {print "/* file:", FILENAME, "*/"} {print $0}' >> dist/profilr.d.ts

node scripts/polish-type-definitions.js
