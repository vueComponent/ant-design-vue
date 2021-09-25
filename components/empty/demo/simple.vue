<docs>
---
order: 2
title:
  zh-CN: 选择图片
  en-US: Chose image
---

## zh-CN

可以通过设置 `image` 为 `Empty.PRESENTED_IMAGE_SIMPLE` 选择另一种风格的图片。

## en-US

You can choose another style of `image` by setting image to `Empty.PRESENTED_IMAGE_SIMPLE`.

</docs>
<template>
  <a-empty :image="simpleImage" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Empty } from 'ant-design-vue';
export default defineComponent({
  setup() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
});
</script>
```
