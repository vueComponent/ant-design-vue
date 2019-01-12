const antd = require('./components');
const req = require.context('./components', true, /^\.\/locale-provider\/(?!__tests__).+_.+\.js$/);

antd.locales = {};

req.keys().forEach(mod => {
  const match = mod.match(/\/([^/]+).js$/);
  antd.locales[match[1]] = req(mod).default;
});

module.exports = antd;
