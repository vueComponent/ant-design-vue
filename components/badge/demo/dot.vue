<docs>
---
order: 3
title: 
  zh-CN: 讨嫌的小红点
  en-US: Red badge
---

## zh-CN

没有具体的数字。

## en-US

This will simply display a red badge, without a specific count.
If count equals 0, it won't display the dot.
</docs>

<template>
  <div id="components-badge-demo-dot">
    <a-badge dot>
      <notification-outlined />
    </a-badge>
    <a-badge :count="0" dot>
      <notification-outlined />
    </a-badge>
    <a-badge dot>
      <a href="#">Link something</a>
    </a-badge>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { NotificationOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    NotificationOutlined,
  },
});
</script>
<style scoped>
#components-badge-demo-dot .anticon-notification {
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
}
</style>
