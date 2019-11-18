<cn>
#### 自定义样式
使用 style 和 className 来定义样式。
</cn>

<us>
#### Customized style
The style and className are available to customize Notification.
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
          style: {
            width: '600px',
            marginLeft: `${335 - 600}px`,
          },
        });
      },
    },
  };
</script>
```
