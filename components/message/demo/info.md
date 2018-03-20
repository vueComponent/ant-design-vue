
<cn>
#### 普通提示
信息提醒反馈。
</cn>

<us>
#### Normal prompt
Normal messages as feedbacks.
</us>

```html
<template>
  <a-button type="primary" @click="info">Display normal message</a-button>
</template>
<script>
  import { message } from 'antd'
  export default {
    methods: {
      info () {
        message.info('This is a normal message');
      },
    }
  }
</script>
```

