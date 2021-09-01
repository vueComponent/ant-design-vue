<docs>
---
order: 6
title:
  zh-CN: 自定义指示符
  en-US: Custom spinning indicator
---

## zh-CN

使用自定义指示符。

## en-US

Use custom loading indicator.

</docs>

<template>
  <a-spin :indicator="indicator" />
</template>
<script lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';
import { defineComponent, h } from 'vue';
export default defineComponent({
  setup() {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '24px',
      },
      spin: true,
    });
    return {
      indicator,
    };
  },
});
</script>
