<docs>
---
order: 4
title:
  zh-CN: 自定义按钮
  en-US: Custom close button
---

## zh-CN

自定义关闭按钮的样式和文字。

## en-US

To customize the style or font of the close button.

</docs>

<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>

<script lang="ts">
import { notification, Button } from 'ant-design-vue';
import { h, defineComponent } from 'vue';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};
export default defineComponent({
  setup() {
    const openNotification = () => {
      const key = `open${Date.now()}`;
      notification.open({
        message: 'Notification Title',
        description:
          'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
        btn: () =>
          h(
            Button,
            {
              type: 'primary',
              size: 'small',
              onClick: () => notification.close(key),
            },
            { default: () => 'Confirm' },
          ),
        key,
        onClose: close,
      });
    };

    return {
      openNotification,
    };
  },
});
</script>
