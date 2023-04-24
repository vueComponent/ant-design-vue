<docs>
---
order: 6
title:
  zh-CN: 相册模式
  en-US: Preview from one image
---

## zh-CN

从一张图片点开相册。

## en-US

Preview a collection from one image.

</docs>

<template>
  <a-image
    :preview="{ visible: false }"
    :width="200"
    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
    @click="visible = true"
  />
  <div style="display: none">
    <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
      <a-image
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
      <a-image
        src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp"
      />
      <a-image
        src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp"
      />
    </a-image-preview-group>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref(false);
</script>
