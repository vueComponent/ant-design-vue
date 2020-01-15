process.env.ENTRY_INDEX = 'dev';

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const importFresh = require('import-fresh');
const replace = require('json-templater/string');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devWebpack = require('./webpack.dev.conf');

const configPath = path.join(__dirname, './config.js');

let { devComponent } = require('./config');

const componentsInPrototype = ['Modal', 'message', 'notification'];

const MAIN_TEMPLATE = `import 'babel-polyfill';
import './index.less';
import 'highlight.js/styles/solarized-light.css';
import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import VueClipboard from 'vue-clipboard2';
import Md from './components/md';
import Api from './components/api';
import demoBox from './components/demoBox';
import demoContainer from './components/demoContainer';
import Modal from '../components/modal';
import message from '../components/message';
import notification from '../components/notification';
{{importComponents}}
{{importStyles}}
import '../components/modal/style';
import '../components/message/style';
import '../components/notification/style';
import Test from '../components/{{name}}/demo/index.vue';
import zhCN from './theme/zh-CN';
import enUS from './theme/en-US';

Vue.use(Vuex);
Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.component(Md.name, Md);
Vue.component(Api.name, Api);
Vue.component('demo-box', demoBox);
Vue.component('demo-container', demoContainer);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;

Vue.use(Modal);
{{install}}

const i18n = new VueI18n({
  locale: enUS.locale,
  messages: {
    [enUS.locale]: { message: enUS.messages },
    [zhCN.locale]: { message: zhCN.messages },
  },
});

const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/test',
    component: () => import('../components/test/index.vue'),
  }, { 
    path: '/*', component: Test 
  }],
});

const store = new Vuex.Store({
  state: {
    username: 'zeka',
  },
  mutations: {
    update(state, payload) {
      state.username = payload.username;
    },
  },
});
new Vue({
  el: '#app',
  i18n,
  router,
  store,
});
`;

const OUTPUT_PATH = path.join(__dirname, '../site/dev.js');

const generateEntry = components =>
  Object.keys(components)
    .map(component => `import ${component} from '../components/${components[component]}';`)
    .join('\n');

const generateStyles = components =>
  Object.keys(components)
    .map(component => `import '../components/${components[component]}/style';`)
    .join('\n');

const generateInstall = components =>
  Object.keys(components)
    .map(component => `Vue.use(${component});`)
    .join('\n');

const renderTemplate = name => {
  const components = {
    Tooltip: 'tooltip', // for DemoBox
  };

  const demoPaths = fs
    .readdirSync(path.join(__dirname, `../components/${name}/demo`))
    .map(p => `../components/${name}/demo/${p}`);
  const testPaths = fs
    .readdirSync(path.join(__dirname, `../components/test`))
    .map(p => `../components/test/${p}`);
  [...demoPaths, ...testPaths].forEach(demoPath => {
    const demo = fs.readFileSync(path.join(__dirname, demoPath)).toString();

    const componentsInDemo = demo.match(/a-(\w+(-\w+)*)/g) || [];
    componentsInDemo.forEach(n => {
      const componentName = n.replace(/-(\w)/g, ($, $1) => $1.toUpperCase()).replace(/^a/, '');

      if (componentsInPrototype.includes(componentName)) {
        return;
      }

      const componentPath = path.join(__dirname, `../components/${n.replace(/^a-/, '')}`);
      if (fs.existsSync(componentPath)) {
        components[componentName] = n.replace(/^a-/, '');
      }
    });
  });

  const importComponents = generateEntry(components);
  const importStyles = generateStyles(components);
  const install = generateInstall(components);
  const template = replace(MAIN_TEMPLATE, {
    importComponents,
    importStyles,
    install,
    name,
  });
  fs.writeFileSync(OUTPUT_PATH, template);
};

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

if (!fsExistsSync(path.join(__dirname, '../components/test/index.vue'))) {
  if (!fsExistsSync(path.join(__dirname, '../components/test'))) {
    fs.mkdirSync(path.join(__dirname, '../components/test'));
  }
  fs.writeFileSync(path.join(__dirname, '../components/test/index.vue'), `<template></template>`);
}

let demoWatcher;

chokidar.watch(configPath, { ignoreInitial: true }).on('change', async () => {
  devComponent = importFresh(configPath).devComponent;

  demoWatcher && (await demoWatcher.close());

  demoWatcher = chokidar.watch(path.join(__dirname, `../components/${devComponent}/demo`));
  demoWatcher.on('change', () => {
    renderTemplate(devComponent);
  });

  renderTemplate(devComponent);
});

testWatcher = chokidar.watch(path.join(__dirname, `../components/test`));
testWatcher.on('change', () => {
  renderTemplate(devComponent);
});

renderTemplate(devComponent);

const compiler = webpack(devWebpack);

const configuration = devWebpack.devServer;

const server = new WebpackDevServer(compiler, configuration);
server.listen(configuration.port);
