<cn>
#### 12 小时制
12 小时制的时间选择器，默认的 format 为 `h:mm:ss a`。
</cn>

<us>
#### 12 hours
TimePicker of 12 hours format, with default format `h:mm:ss a`.
</us>

```vue
<template>
  <div>
    <a-time-picker use12-hours @change="onChange" />
    <a-time-picker use12-hours format="h:mm:ss A" @change="onChange" />
    <a-time-picker use12-hours format="h:mm a" @change="onChange" />
  </div>
</template>
<script>
export default {
  methods: {
    onChange(time, timeString) {
      console.log(time, timeString);
    },
  },
};
</script>
```
