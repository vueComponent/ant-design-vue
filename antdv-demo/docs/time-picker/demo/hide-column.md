<cn>
#### 选择时分
TimePicker 浮层中的列会随着 `format` 变化，当略去 `format` 中的某部分时，浮层中对应的列也会消失。
</cn>

<us>
#### Hour and minute
While part of `format` is omitted, the corresponding column in panel will disappear, too.
</us>

```vue
<template>
  <a-time-picker :default-value="moment('12:08', 'HH:mm')" format="HH:mm" />
</template>
<script>
import moment from 'moment';
export default {
  methods: {
    moment,
  },
};
</script>
```
