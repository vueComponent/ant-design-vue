<docs>
---
order: 9
title:
  zh-CN: 可点击
  en-US: Clickable
---

## zh-CN

设置 `v-model` 后，Steps 变为可点击状态。

## en-US

Setting `v-model` makes Steps clickable.
</docs>

<template>
  <div>
    <a-steps v-model:current="current">
      <a-step title="Step 1" description="This is a description." />
      <a-step title="Step 2" description="This is a description." />
      <a-step title="Step 3" description="This is a description." />
    </a-steps>
    <a-divider />
    <a-steps v-model:current="current" direction="vertical">
      <a-step title="Step 1" description="This is a description." />
      <a-step title="Step 2" description="This is a description." />
      <a-step title="Step 3" description="This is a description." />
    </a-steps>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const current = ref<number>(0);

    return {
      current,
    };
  },
});
</script>
