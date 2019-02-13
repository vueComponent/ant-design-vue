import 'babel-polyfill';
import '../components/style.js';
import './index.less';
import 'nprogress/nprogress.css';
import 'highlight.js/styles/solarized-light.css';
import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import VueClipboard from 'vue-clipboard2';
import NProgress from 'nprogress';
import routes from './routes';
import Md from './components/md';
import Api from './components/api';
import './components';
import demoBox from './components/demoBox';
import demoContainer from './components/demoContainer';
import zhCN from './theme/zh-CN';
import enUS from './theme/en-US';
import { isZhCN } from './util';

const mountedCallback = {
  install: (Vue, options) => {
    Vue.directive('mountedCallback', {
      inserted: function(el, binding, vnode) {
        binding.value(vnode);
      },
    });
  },
};

Vue.use(Vuex);
Vue.use(mountedCallback);
Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.component(Md.name, Md);
Vue.component(Api.name, Api);
Vue.component('demo-box', demoBox);
Vue.component('demo-container', demoContainer);

const i18n = new VueI18n({
  locale: isZhCN(location.pathname) ? zhCN.locale : enUS.locale,
  messages: {
    [enUS.locale]: { message: enUS.messages },
    [zhCN.locale]: { message: zhCN.messages },
  },
});

const router = new VueRouter({
  mode: 'history',
  fallback: false,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  next();
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
