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
  <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
    <a-image v-for="item in items" :key="item" :src="item" style="display: none" />
  </a-image-preview-group>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
const visible = ref(false);
const items = reactive([
  'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
  'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
  'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
]);
</script>
