<docs>
---
order: 4
title:
  zh-CN: 设置锚点滚动偏移量
  en-US: Set Anchor scroll offset
---

## zh-CN

锚点目标滚动到屏幕正中间。

## en-US

Anchor target scroll to screen center.
</docs>

<template>
  <a-anchor
    :target-offset="targetOffset"
    :items="[
      {
        key: '1',
        href: '#components-anchor-demo-basic',
        title: 'Basic demo',
      },
      {
        key: '2',
        href: '#components-anchor-demo-static',
        title: 'Static demo',
      },
      {
        key: '3',
        href: '#api',
        title: 'API',
        children: [
          {
            key: '4',
            href: '#anchor-props',
            title: 'Anchor Props',
          },
          {
            key: '5',
            href: '#link-props',
            title: 'Link Props',
          },
        ],
      },
    ]"
  ></a-anchor>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const targetOffset = ref<number | undefined>(undefined);
onMounted(() => {
  targetOffset.value = window.innerHeight / 2;
});
</script>
