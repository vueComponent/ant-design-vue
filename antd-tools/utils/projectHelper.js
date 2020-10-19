const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

function getProjectPath(...filePath) {
  return path.join(cwd, ...filePath);
}

function resolve(moduleName) {
  return require.resolve(moduleName);
}

// We need hack the require to ensure use package module first
// For example, `typescript` is required by `gulp-typescript` but provided by `antd`
let injected = false;
function injectRequire() {
  if (injected) return;

  const Module = require('module');

  const oriRequire = Module.prototype.require;
  Module.prototype.require = function(...args) {
    const moduleName = args[0];
    try {
      return oriRequire.apply(this, args);
    } catch (err) {
      const newArgs = [...args];
      if (moduleName[0] !== '/') {
        newArgs[0] = getProjectPath('node_modules', moduleName);
      }
      return oriRequire.apply(this, newArgs);
    }
  };

  injected = true;
}

function getConfig() {
  const configPath = getProjectPath('.antd-tools.config.js');
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }

  return {};
}

module.exports = {
  getProjectPath,
  resolve,
  injectRequire,
  getConfig,
};
