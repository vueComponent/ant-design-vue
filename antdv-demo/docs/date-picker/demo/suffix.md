<cn>
#### 后缀图标
最简单的用法，在浮层中可以选择或者输入日期。
</cn>

<us>
#### Suffix
Basic use case. Users can select or input a date in panel.
</us>

```vue
<template>
  <div>
    <a-date-picker @change="onChange">
      <a-icon slot="suffixIcon" type="smile" />
    </a-date-picker>
    <br />
    <a-month-picker placeholder="Select month" @change="onChange">
      <a-icon slot="suffixIcon" type="smile" />
    </a-month-picker>
    <br />
    <a-range-picker @change="onChange">
      <a-icon slot="suffixIcon" type="smile" />
    </a-range-picker>
    <br />
    <a-week-picker placeholder="Select week" @change="onChange">
      <a-icon slot="suffixIcon" type="smile" />
    </a-week-picker>
    <br />
    <a-date-picker suffix-icon="ab" @change="onChange" />
    <br />
    <a-month-picker suffix-icon="ab" placeholder="Select month" @change="onChange" />
    <br />
    <a-range-picker suffix-icon="ab" @change="onChange" />
    <br />
    <a-week-picker suffix-icon="ab" placeholder="Select week" @change="onChange" />
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
