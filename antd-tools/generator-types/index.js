const path = require('path');
const pkg = require('../../package.json');
const { parseAndWrite } = require('./lib/index.js');
const rootPath = path.resolve(__dirname, '../../');

parseAndWrite({
  version: pkg.version,
  name: 'ant-design-vue',
  path: path.resolve(rootPath, './components'),
  typingsPath: path.resolve(rootPath, './typings/global.d.ts'),
  // default match lang
  test: /en-US\.md/,
  outputDir: path.resolve(rootPath, './vetur'),
  tagPrefix: 'a-',
})
  .then(result => {
    // eslint-disable-next-line no-console
    console.log(`generator types success: ${result} tags generated`);
  })
  .catch(error => {
    console.error('generator types error', error);
    return Promise.reject(error);
  });
