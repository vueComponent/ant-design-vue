
<cn>
#### 基本
最简单的用法，4.5 秒后自动关闭。
</cn>

<us>
#### Basic
The simplest usage that close the notification box after 4.5s.
</us>

```html
<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>
<script>
  const close = () => {
    console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
  };
  export default {
    methods: {
      openNotification () {
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: 'Notification Title',
          description: 'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
          btn: (h)=>{
            return h('a-button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.$notification.close(key)
              }
            }, 'Confirm')
          },
          key,
          onClose: close,
        });
      },
    }
  }
</script>
```

