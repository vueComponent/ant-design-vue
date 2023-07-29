<docs>
---
order: 1
title:
  zh-CN: 固定状态改变的回调
  en-US: Callback
---

## zh-CN

可以获得是否固定的状态。

## en-US

Callback with affixed state.

</docs>

<template>
  <a-affix :offset-top="120" @change="change">
    <a-button>120px to affix top</a-button>
  </a-affix>
</template>
<script lang="ts" setup>
const change = (affixed: boolean) => {
  console.log(affixed);
};
</script>
