'use strict';

const { dirname } = require('path');
const fs = require('fs');
const { getProjectPath } = require('./utils/projectHelper');

function replacePath(path) {
  if (path.node.source && /\/lib\//.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace('/lib/', '/es/');
    const esPath = dirname(getProjectPath('node_modules', esModule));
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule;
    }
  }

  // @ant-design/icons-vue/xxx => @ant-design/icons-vue/es/icons/xxx
  const antdIconMatcher = /@ant-design\/icons-vue\/([^/]*)$/;
  if (path.node.source && antdIconMatcher.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace(
      antdIconMatcher,
      (_, iconName) => `@ant-design/icons-vue/es/icons/${iconName}`,
    );
    const esPath = dirname(getProjectPath('node_modules', esModule));
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
