<cn>
#### 三种大小
三种大小的输入框，大的用在表单中，中的为默认。
</cn>

<us>
#### Three Sizes
The input box comes in three sizes. large is used in the form, while the medium size is the default.
</us>

```vue
<template>
  <div>
    <a-time-picker :default-value="moment('12:08:23', 'HH:mm:ss')" size="large" />
    <a-time-picker :default-value="moment('12:08:23', 'HH:mm:ss')" />
    <a-time-picker :default-value="moment('12:08:23', 'HH:mm:ss')" size="small" />
  </div>
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
