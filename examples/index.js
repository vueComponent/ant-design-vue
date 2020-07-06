import '@babel/polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import {
  AutoComplete,
  Radio,
  Spin,
  Select,
  Input,
  InputNumber,
  Rate,
  Button,
  Upload,
  Icon,
  Modal,
  Progress,
  Tooltip,
  Col,
  Row,
  FormModel,
  Switch,
  Checkbox,
  notification,
  message,
} from 'ant-design-vue';
import 'ant-design-vue/style.js';

const basic = {
  render() {
    return this.$slots?.default();
  },
};
const app = createApp(App);
app.config.globalProperties.$notification = notification;
app.config.globalProperties.$message = message;
app
  .component('demo-sort', { ...basic })
  .component('md', { ...basic })
  .component('api', { ...basic })
  .component('CN', { ...basic })
  .component('US', { ...basic })
  .use(Select)
  .use(Spin)
  .use(Upload)
  .use(Button)
  .use(Icon)
  .use(Modal)
  .use(Progress)
  .use(Rate)
  .use(Input)
  .use(Tooltip)
  .use(Col)
  .use(Row)
  .use(Radio)
  .use(Switch)
  .use(Checkbox)
  .use(InputNumber)
  .use(AutoComplete)
  .use(FormModel)
  .mount('#app');
