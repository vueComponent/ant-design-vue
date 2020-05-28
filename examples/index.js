import '@babel/polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import Button from 'ant-design-vue/button';
import ConfigProvider from 'ant-design-vue/config-provider';
import 'ant-design-vue/button/style/index.less';

createApp(App)
  .use(Button)
  .use(ConfigProvider)
  .mount('#app');
