<cn>
#### 日期时间选择
增加选择时间功能，当 `showTime` 为一个对象时，其属性会传递给内建的 `TimePicker`。
</cn>

<us>
#### Choose Time
This property provide an additional time selection. When `showTime` is an Object, its properties will be passed on to built-in `TimePicker`.
</us>

```tpl
<template>
  <div>
    <a-date-picker showTime placeholder="Select Time" @change="onChange" @ok="onOk" />
    <br />
    <a-range-picker
      :showTime="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onChange"
      @ok="onOk"
    />
  </div>
</template>
<script>
  export default {
    methods: {
      onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      },
      onOk(value) {
        console.log('onOk: ', value);
      },
    },
  };
</script>
```
