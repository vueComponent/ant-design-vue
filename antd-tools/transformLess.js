const less = require('less');
const { readFileSync } = require('fs');
const path = require('path');
const postcss = require('postcss');
const NpmImportPlugin = require('less-plugin-npm-import');
const postcssConfig = require('./postcssConfig');

function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })],
    javascriptEnabled: true,
  };
  return less
    .render(data, lessOpts)
    .then(result => {
      const source = result.css;
      return postcss(postcssConfig.plugins).process(source);
    })
    .then(r => {
      return r.css;
    });
}

module.exports = transformLess;
