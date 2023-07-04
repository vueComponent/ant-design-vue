'use strict';

const runCmd = require('./runCmd');

module.exports = function (done) {
  if (process.env.NPM_CLI) {
    done(process.env.NPM_CLI);
    return;
  }
  runCmd('which', ['tnpm'], code => {
    let npm = 'npm';
    if (!code) {
      npm = 'tnpm';
    }
    done(npm);
  });
};
