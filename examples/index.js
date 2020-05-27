import '@babel/polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import Button from 'ant-design-vue/button';
import 'ant-design-vue/button/style/index.less';

createApp(App)
  .use(Button)
  .mount('#app');
