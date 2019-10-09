<cn>
#### 自定义图标
图标可以被自定义。
</cn>

<us>
#### Customized Icon
The icon can be customized to any vue node or (h) => vue node.
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
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
      },
    },
  };
</script>
```
