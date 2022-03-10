'use strict';

// NOTE: the following code was partially adopted from https://github.com/iarna/in-publish
module.exports = function getNpmArgs() {
  // https://github.com/iarna/in-publish/pull/14
  if (process.env.npm_command) {
    return [process.env.npm_command];
  }

  let npmArgv = null;

  try {
    npmArgv = JSON.parse(process.env.npm_config_argv);
  } catch (err) {
    return null;
  }

  if (typeof npmArgv !== 'object' || !npmArgv.cooked || !Array.isArray(npmArgv.cooked)) {
    return null;
  }

  return npmArgv.cooked;
};
