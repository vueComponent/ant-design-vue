# 自定义时间库

在 V3 版本开始，默认使用 dayjs 替换了 momentjs 库，如果你需要使用 momentjs 或者 date-fns 日期库，你可以通过如下方式替换：


### 替换 DatePicker
```js
// moment 或者 date-fns
import DatePicker from 'ant-design-vue/es/date-picker/moment';
import TimePicker from 'ant-design-vue/es/time-picker/moment';
import Calendar from 'ant-design-vue/es/calendar/moment';
// import DatePicker from 'ant-design-vue/es/date-picker/date-fns';
// import TimePicker from 'ant-design-vue/es/time-picker/date-fns';
// import Calendar from 'ant-design-vue/es/calendar/date-fns';
import { createApp } from 'vue';
import App from './App.vue';
import antd from 'ant-design-vue';
const app = createApp(App);
app
  .use(DatePicker)
  .use(TimePicker)
  .use(Calendar)
  .use(antd)
  .mount('#app');
```

> 注意: 如果你需要全局注册 ant-design-vue 组件库，那么 `use(DatePicker)` `use(TimePicker)` `use(Calendar)` 必须在 `use(antd)` 之前执行，否则无法覆盖默认的 dayjs 版本。