<cn>
#### 基本
最简单的用法，在浮层中可以选择或者输入日期。
</cn>

<us>
#### Basic
Basic use case. Users can select or input a date in panel.
</us>

```tpl
<template>
  <div>
    <a-date-picker @change="onChange" />
    <br />
    <a-month-picker @change="onChange" placeholder="Select month" />
    <br />
    <a-range-picker @change="onChange" />
    <br />
    <a-week-picker @change="onChange" placeholder="Select week" />
  </div>
</template>
<script>
  export default {
    methods: {
      onChange(date, dateString) {
        console.log(date, dateString);
      },
    },
  };
</script>
```
