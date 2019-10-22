<cn>
#### 后缀图标
点击 TimePicker，然后可以在浮层中选择或者输入某一时间。
</cn>

<us>
#### Suffix
Click `TimePicker`, and then we could select or input a time in panel.
</us>

```tpl
<template>
  <a-time-picker @change="onChange" :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')">
    <a-icon type="smile" slot="suffixIcon" />
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
