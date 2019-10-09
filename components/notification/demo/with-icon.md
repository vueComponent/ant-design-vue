<cn>
#### 带有图标的通知提醒框
通知提醒框左侧有图标。
</cn>

<us>
#### Notification with icon
A notification box with a icon at the left side.
</us>

```tpl
<template>
  <div>
    <a-button @click="() => openNotificationWithIcon('success')">Success</a-button>
    <a-button @click="() => openNotificationWithIcon('info')">Info</a-button>
    <a-button @click="() => openNotificationWithIcon('warning')">Warning</a-button>
    <a-button @click="() => openNotificationWithIcon('error')">Error</a-button>
  </div>
</template>
<script>
  export default {
    methods: {
      openNotificationWithIcon(type) {
        this.$notification[type]({
          message: 'Notification Title',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        });
      },
    },
  };
</script>
```
