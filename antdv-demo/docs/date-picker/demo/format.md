<cn>
#### 日期格式
使用 `format` 属性，可以自定义日期显示格式。
</cn>

<us>
#### Date Format
We can set the date format by `format`.
</us>

```vue
<template>
  <div>
    <a-date-picker :default-value="moment('2015/01/01', dateFormat)" :format="dateFormat" />
    <br />
    <a-date-picker
      :default-value="moment('01/01/2015', dateFormatList[0])"
      :format="dateFormatList"
    />
    <br />
    <a-month-picker :default-value="moment('2015/01', monthFormat)" :format="monthFormat" />
    <br />
    <a-range-picker
      :default-value="[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]"
      :format="dateFormat"
    />
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data() {
    return {
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      dateFormatList: ['DD/MM/YYYY', 'DD/MM/YY'],
    };
  },
  methods: {
    moment,
  },
};
</script>
```
