'use strict';

const path = require('path');

module.exports = function getRunCmdEnv() {
  const env = {};
  Object.keys(process.env).forEach(key => {
    env[key] = process.env[key];
  });
  // make sure `antd-tools/node_modules/.bin` in the PATH env
  const nodeModulesBinDir = path.join(__dirname, '../../node_modules/.bin');
  env.PATH = env.PATH ? `${nodeModulesBinDir}:${env.PATH}` : nodeModulesBinDir;
  return env;
};
