import '@babel/polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import Avatar from 'ant-design-vue/avatar';
import Breadcrumb from 'ant-design-vue/breadcrumb';
import Button from 'ant-design-vue/button';
import Comment from 'ant-design-vue/comment';
import Drawer from 'ant-design-vue/drawer';
import Affix from 'ant-design-vue/affix';
import Alert from 'ant-design-vue/alert';
import Divider from 'ant-design-vue/divider';
import Anchor from 'ant-design-vue/anchor';
import Radio from 'ant-design-vue/radio';
import ConfigProvider from 'ant-design-vue/config-provider';
import Result from 'ant-design-vue/result';
import Spin from 'ant-design-vue/spin';
import PageHeader from 'ant-design-vue/page-header';
import Skeleton from 'ant-design-vue/skeleton';
import Empty from 'ant-design-vue/empty';
import Timeline from 'ant-design-vue/timeline';
import Col from 'ant-design-vue/col';
import Row from 'ant-design-vue/row';
import Tooltip from 'ant-design-vue/tooltip';
import Descriptions from 'ant-design-vue/descriptions';
import BackTop from 'ant-design-vue/back-top';
import Tag from 'ant-design-vue/tag';
import Popconfirm from 'ant-design-vue/popconfirm';
import Popover from 'ant-design-vue/popover';
import notification from 'ant-design-vue/notification';
import message from 'ant-design-vue/message';
import 'ant-design-vue/style.js';

const app = createApp(App);
app.config.globalProperties.$notification = notification;
app.config.globalProperties.$message = message;
app
  .use(Avatar)
  .use(Breadcrumb)
  .use(Button)
  .use(Comment)
  .use(ConfigProvider)
  .use(Drawer)
  .use(Affix)
  .use(Alert)
  .use(Radio)
  .use(Divider)
  .use(Result)
  .use(PageHeader)
  .use(Anchor)
  .use(Skeleton)
  .use(Spin)
  .use(Empty)
  .use(Timeline)
  .use(Col)
  .use(Row)
  .use(Tooltip)
  .use(Descriptions)
  .use(BackTop)
  .use(Tag)
  .use(Popconfirm)
  .use(Popover)
  .mount('#app');
