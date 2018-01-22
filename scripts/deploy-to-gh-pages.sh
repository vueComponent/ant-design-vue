#!/bin/bash

set -e # exit with nonzero exit code if anything fails

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then

echo "Starting to update gh-pages\n"

rm -rf dist
mkdir dist

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"

./node_modules/.bin/webpack --config webpack.prod.config.js

cd dist
git init
git add -f .
git commit -m "Travis build"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/vueComponent/ant-design.git" master:gh-pages > /dev/null


echo "Done updating gh-pages\n"

else
 echo "Skipped updating gh-pages, because build is not triggered from the master branch."
fi;
