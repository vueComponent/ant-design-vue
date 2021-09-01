<docs>
---
order: 3
title:
  zh-CN: 自定义尺寸
  en-US: Customize Size
---

## zh-CN

自定义间距大小。

## en-US

Custom spacing size.
</docs>

<template>
  <div>
    <a-slider v-model:value="size" />
    <br />
    <br />
    <a-space :size="size">
      <a-button type="primary">Primary</a-button>
      <a-button>Default</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="link">Link</a-button>
    </a-space>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    return {
      size: ref(8),
    };
  },
});
</script>
