<cn>
#### 位置
可以设置通知从右上角、右下角、左下角、左上角弹出。
</cn>

<us>
#### Placement
A notification box can pop up from `topRight` or `bottomRight` or `bottomLeft` or `topLeft`.
</us>

```vue
<template>
  <div>
    <a-button type="primary" @click="openNotification('topLeft')">
      <a-icon type="radius-upleft" />
      topLeft
    </a-button>
    <a-button type="primary" @click="openNotification('topRight')">
      <a-icon type="radius-upright" />
      topRight
    </a-button>
    <a-divider />
    <a-button type="primary" @click="openNotification('bottomLeft')">
      <a-icon type="radius-bottomleft" />
      bottomLeft
    </a-button>
    <a-button type="primary" @click="openNotification('bottomRight')">
      <a-icon type="radius-bottomright" />
      bottomRight
    </a-button>
  </div>
</template>
<script>
export default {
  methods: {
    openNotification(placement) {
      this.$notification.open({
        message: `Notification ${placement}`,
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        placement,
      });
    },
  },
};
</script>
```
