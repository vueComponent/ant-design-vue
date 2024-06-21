<docs>
---
order: 6
title:
  zh-CN: 自定义工具栏
  en-US: Custom toolbar render
---

## zh-CN

可以自定义工具栏并添加下载原图或翻转旋转后图片的按钮。

## en-US

You can customize the toolbar and add a button for downloading the original image or downloading the flipped and rotated image.

</docs>

<template>
  <a-image :width="200" :src="src">
    <template #toolbarRender="{ actions, transform }">
      <a-space :size="12" class="toolbar-wrapper">
        <DownloadOutlined @click="onDownload" />
        <SwapOutlined :rotate="90" @click="actions.onFlipY" />
        <SwapOutlined @click="actions.onFlipX" />
        <RotateLeftOutlined @click="actions.onRotateLeft" />
        <RotateRightOutlined @click="actions.onRotateRight" />
        <ZoomOutOutlined :disabled="transform.scale === 1" @click="actions.onZoomOut" />
        <ZoomInOutlined :disabled="transform.scale === 50" @click="actions.onZoomIn" />
      </a-space>
    </template>
  </a-image>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';

const src = ref('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');
const onDownload = () => {
  fetch(src.value)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'image.png';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      link.remove();
    });
};
</script>

<style scoped>
.toolbar-wrapper {
  position: fixed;
  bottom: 32px;
  left: 50%;
  padding: 0px 24px;
  color: #fff;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  transform: translateX(-50%);
}

.toolbar-wrapper .anticon {
  padding: 12px;
  cursor: pointer;
}

.toolbar-wrapper .anticon[disabled='true'] {
  cursor: not-allowed;
  opacity: 0.3;
}

.toolbar-wrapper .anticon:hover {
  opacity: 0.3;
}
</style>
