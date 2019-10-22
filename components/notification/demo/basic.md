<cn>
#### 基本
最简单的用法，4.5 秒后自动关闭。
</cn>

<us>
#### Basic
The simplest usage that close the notification box after 4.5s.
</us>

```tpl
<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>
<script>
  export default {
    methods: {
      openNotification() {
        this.$notification.open({
          message: 'Notification Title',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      },
    },
  };
</script>
```
