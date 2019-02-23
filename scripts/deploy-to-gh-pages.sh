#!/bin/bash

set -e # exit with nonzero exit code if anything fails

BUMP="bump "
SITE="update site"

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_COMMIT_MESSAGE == *$BUMP* || $TRAVIS_COMMIT_MESSAGE == *$SITE* ]]; then

echo "Starting to update gh-pages\n"

rm -rf _site
mkdir _site

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"

npm run site

cd _site
git init
git add -f .
git commit -m "Travis build"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/vueComponent/ant-design-vue.git" master:gh-pages > /dev/null


echo "Done updating gh-pages\n"

else
 echo "Skipped updating gh-pages, because build is not triggered from the master branch."
fi;
