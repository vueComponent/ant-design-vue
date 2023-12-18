<docs>
---
order: 10
title:
  zh-CN: Hooks 调用（推荐）
  en-US: Hooks Usage (Recommend)
---

## zh-CN

通过 `notification.useNotification` 创建支持读取 context 的 `contextHolder`。请注意，我们推荐通过顶层注册的方式代替 `notification` 静态方法，因为静态方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。

## en-US

Use `notification.useNotification` to get `contextHolder` with context accessible issue. Please note that, we recommend to use top level registration instead of `notification` static method, because static method cannot consume context, and ConfigProvider data will not work.

</docs>
<template>
  <a-space>
    <a-button type="primary" @click="() => open('topLeft')">
      <RadiusUpleftOutlined />
      topLeft
    </a-button>
    <a-button type="primary" @click="() => open('topRight')">
      <RadiusUprightOutlined />
      topRight
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="() => open('bottomLeft')">
      <RadiusBottomleftOutlined />
      bottomLeft
    </a-button>
    <a-button type="primary" @click="() => open('bottomRight')">
      <RadiusBottomrightOutlined />
      bottomRight
    </a-button>
  </a-space>
  <contextHolder />
</template>

<script lang="ts" setup>
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons-vue';
import { NotificationPlacement, notification } from 'ant-design-vue';
const [api, contextHolder] = notification.useNotification();
const open = (placement: NotificationPlacement) => openNotification(placement);
const openNotification = (placement: NotificationPlacement) => {
  api.info({
    message: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};
</script>
