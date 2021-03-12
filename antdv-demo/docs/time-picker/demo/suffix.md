<cn>
#### 后缀图标
点击 TimePicker，然后可以在浮层中选择或者输入某一时间。
</cn>

<us>
#### Suffix
Click `TimePicker`, and then we could select or input a time in panel.
</us>

```vue
<template>
  <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" @change="onChange">
    <a-icon slot="suffixIcon" type="smile" />
  </a-time-picker>
</template>
<script>
import moment from 'moment';
export default {
  methods: {
    moment,
    onChange(time, timeString) {
      console.log(time, timeString);
    },
  },
};
</script>
```
