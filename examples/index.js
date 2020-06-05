import '@babel/polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import Button from 'ant-design-vue/button';
import Drawer from 'ant-design-vue/drawer';
import Affix from 'ant-design-vue/affix';
import Alert from 'ant-design-vue/alert';
import Divider from 'ant-design-vue/divider';
import ConfigProvider from 'ant-design-vue/config-provider';
import Spin from 'ant-design-vue/Spin';
import Empty from 'ant-design-vue/empty';
import 'ant-design-vue/style.js';

createApp(App)
  .use(Button)
  .use(ConfigProvider)
  .use(Drawer)
  .use(Affix)
  .use(Alert)
  .use(Divider)
  .use(Spin)
  .use(Empty)
  .mount('#app');
