<docs>
---
order: 4
title:
  zh-CN: 自定义预览图片
  en-US: Custom preview image
---

## zh-CN

可以设置不同的预览图片。可以自定义预览图的加载占位符(placeholder)。

## en-US

You can set different preview image. You can also customize the loading placeholder of preview image with VNode.

</docs>

<template>
  <a-image
    src="https://aliyuncdn.antdv.com/logo.png"
    :width="200"
    :preview="{
      src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      placeholder: () => CustomLoadingComp,
    }"
  />
  <a-image
    :width="200"
    src="https://aliyuncdn.antdv.com/logo.png"
    :preview="{
      src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      placeholder: true,
    }"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { theme } from 'ant-design-vue';
const { token } = theme.useToken();

const CustomLoadingComp = h(LoadingOutlined, {
  style: {
    fontSize: '256px',
    color: token.value.colorPrimary,
  },
  spin: true,
});
</script>
