'use strict';

const path = require('path');
const isWindows = require('is-windows');

module.exports = function getRunCmdEnv() {
  const env = {};
  Object.keys(process.env).forEach(key => {
    env[key] = process.env[key];
  });
  // make sure `antd-tools/node_modules/.bin` in the PATH env
  const nodeModulesBinDir = path.join(__dirname, '../../node_modules/.bin');

  Object.entries(env)
    .filter(v => v.slice(0, 1).pop().toLowerCase() === 'path')
    .forEach(v => {
      const key = v.slice(0, 1).pop();
      env[key] = env[key]
        ? `${nodeModulesBinDir}${isWindows() ? ';' : ':'}${env[key]}`
        : nodeModulesBinDir;
    });
  return env;
};
