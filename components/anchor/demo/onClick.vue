<docs>
---
order: 2
title:
  zh-CN: 自定义 click 事件
  en-US: Customize the click event
---

## zh-CN

点击锚点不记录历史。

## en-US

Clicking on an anchor does not record history.
</docs>

<template>
  <a-anchor
    :affix="false"
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
    @click="handleClick"
  ></a-anchor>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { AnchorProps } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const handleClick: AnchorProps['onClick'] = (e, link) => {
      e.preventDefault();
      console.log(link);
    };
    return {
      handleClick,
    };
  },
});
</script>
