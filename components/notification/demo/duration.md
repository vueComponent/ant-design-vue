<cn>
#### 自动关闭的延时
自定义通知框自动关闭的延时，默认`4.5s`，取消自动关闭只要将该值设为 `0` 即可。
</cn>

<us>
#### Duration after which the notification box is closed
`Duration` can be used to specify how long the notification stays open. After the duration time elapses,
the notification closes automatically. If not specified, default value is 4.5 seconds. If you set the value to 0,
the notification box will never close automatically.
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
            'I will never close automatically. I will be close automatically. I will never close automatically.',
          duration: 0,
        });
      },
    },
  };
</script>
```
