'use strict';

const { join, dirname } = require('path');
const fs = require('fs');

const cwd = process.cwd();

function replacePath(path) {
  if (path.node.source && /\/lib\//.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace('/lib/', '/es/');
    const esPath = dirname(join(cwd, `node_modules/${esModule}`));
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule;
    }
  }
}

function replaceLib() {
  return {
    visitor: {
      ImportDeclaration: replacePath,
      ExportNamedDeclaration: replacePath,
    },
  };
}

module.exports = replaceLib;
