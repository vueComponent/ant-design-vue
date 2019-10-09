<cn>
#### 预设范围
可以预设常用的日期范围以提高用户体验。
</cn>

<us>
#### Presetted Ranges
We can set presetted ranges to RangePicker to improve user experience.
</us>

```tpl
<template>
  <div>
    <a-range-picker
      :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
      @change="onChange"
    />
    <br />
    <a-range-picker
      :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
      showTime
      format="YYYY/MM/DD HH:mm:ss"
      @change="onChange"
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
      };
    },
    methods: {
      moment,
      onChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      },
    },
  };
</script>
```
