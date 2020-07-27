import '@babel/polyfill';
import 'ant-design-vue/style.js';
import { createApp, version } from 'vue';
import App from './App.vue';
import antd from 'ant-design-vue/index.js';

// eslint-disable-next-line no-console
console.log('Vue version: ', version);
const basic = (_, { slots }) => {
  return slots && slots.default && slots.default();
};
const app = createApp(App);
app
  .component('demo-sort', basic)
  .component('md', basic)
  .component('api', basic)
  .component('CN', basic)
  .component('US', basic)
  .component('demo-container', basic)
  .use(antd)
  .mount('#app');
