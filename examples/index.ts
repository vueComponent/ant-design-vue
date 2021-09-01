import '../components/style';
import { createApp, version } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import antd from '../components';

// eslint-disable-next-line no-console
console.log('Vue version: ', version);
const basic = (_, { slots }) => {
  return slots && slots.default && slots.default();
};

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});
const app = createApp(App);
app.use(router);
app
  .component('DemoSort', basic)
  .component('md', basic)
  .component('api', basic)
  .component('CN', basic)
  .component('US', basic)
  .component('demo-container', basic)
  .use(antd)
  .mount('#app');
