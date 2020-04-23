import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/style.js';
import Comp from './Comp.vue';

Vue.component('Comp', Comp);

Vue.use(Antd);

new Vue({
  el: '#app',
  render: h => h(App),
});
