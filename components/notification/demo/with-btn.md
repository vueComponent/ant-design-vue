<cn>
#### 自定义按钮
自定义关闭按钮的样式和文字。
</cn>

<us>
#### Custom close button
To customize the style or font of the close button.
</us>

```tpl
<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>
<script>
  const close = () => {
    console.log(
      'Notification was closed. Either the close button was clicked or duration time elapsed.',
    );
  };
  export default {
    methods: {
      openNotification() {
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: 'Notification Title',
          description:
            'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                on: {
                  click: () => this.$notification.close(key),
                },
              },
              'Confirm',
            );
          },
          key,
          onClose: close,
        });
      },
    },
  };
</script>
```
