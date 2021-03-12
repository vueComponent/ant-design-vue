#!/usr/bin/env bash
rm -rf dist
mkdir dist
./node_modules/.bin/webpack --config webpack.site.config.js
cp dist/index.html index.html
