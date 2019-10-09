<cn>
#### 后缀图标
最简单的用法，在浮层中可以选择或者输入日期。
</cn>

<us>
#### Suffix
Basic use case. Users can select or input a date in panel.
</us>

```tpl
<template>
  <div>
    <a-date-picker @change="onChange">
      <a-icon slot="suffixIcon" type="smile" />
    </a-date-picker>
    <br />
    <a-month-picker @change="onChange" placeholder="Select month">
      <a-icon slot="suffixIcon" type="smile" />
    </a-month-picker>
    <br />
    <a-range-picker @change="onChange">
      <a-icon slot="suffixIcon" type="smile" />
    </a-range-picker>
    <br />
    <a-week-picker @change="onChange" placeholder="Select week">
      <a-icon slot="suffixIcon" type="smile" />
    </a-week-picker>
    <br />
    <a-date-picker suffixIcon="ab" @change="onChange" />
    <br />
    <a-month-picker suffixIcon="ab" @change="onChange" placeholder="Select month" />
    <br />
    <a-range-picker suffixIcon="ab" @change="onChange" />
    <br />
    <a-week-picker suffixIcon="ab" @change="onChange" placeholder="Select week" />
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
