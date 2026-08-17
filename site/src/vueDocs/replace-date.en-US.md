# custom date library

Starting from the V3 version, the momentjs library is replaced by dayjs by default. If you need to use the momentjs or date-fns date library, you can replace it as follows:

### 替换 DatePicker

```js
// moment or date-fns
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
app.use(antd).use(DatePicker).use(TimePicker).use(Calendar).mount('#app');
```

> Note: If you need to register the ant-design-vue component library globally, `use(DatePicker)`, `use(TimePicker)`, and `use(Calendar)` must be executed after `use(antd)` to override the default dayjs-based components.
