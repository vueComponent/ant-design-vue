<docs>
---
order: 5
title:
  zh-CN: 监听锚点链接改变
  en-US: Listening for anchor link change
---

## zh-CN

监听锚点链接改变。

## en-US

Listening for anchor link change.
</docs>

<template>
  <a-anchor :affix="false" @change="onChange">
    <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo" />
    <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
    <a-anchor-link href="#API" title="API">
      <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
      <a-anchor-link href="#Link-Props" title="Link Props" />
    </a-anchor-link>
  </a-anchor>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const onChange = (link: string) => {
      console.log('Anchor:OnChange', link);
    };
    return {
      onChange,
    };
  },
});
</script>
