import '@babel/polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import Button from 'ant-design-vue/button';
import Drawer from 'ant-design-vue/drawer';
import ConfigProvider from 'ant-design-vue/config-provider';
import 'ant-design-vue/button/style/index.less';
import 'ant-design-vue/drawer/style/index.less';

createApp(App)
  .use(Button)
  .use(ConfigProvider)
  .use(Drawer)
  .mount('#app');
