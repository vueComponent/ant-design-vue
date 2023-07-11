<docs>
---
order: 0
title:
  zh-CN: 渲染触发器的默认文本
  en-US: Renders the default text of the trigger
---

## zh-CN

渲染触发器的默认文本, `showText` 为 `true` 时生效。自定义文本时，可以使用 `showText` 为函数的方式，返回自定义的文本。

## en-US

Renders the default text of the trigger, effective when `showText` is `true`. When customizing text, you can use `showText` as a function to return custom text.

</docs>

<template>
  <a-space direction="vertical">
    <a-color-picker :show-text="true" />
    <a-color-picker :show-text="showText1" />
    <a-color-picker :open="open" :show-text="showText2" @openChange="handleOpenChange" />
  </a-space>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

const open = ref(false);

const handleOpenChange = val => {
  open.value = val;
};

const showText1 = color => h('span', `Custom Text (${color.toHexString()})`);
const showText2 = () =>
  h(DownOutlined, {
    rotate: open.value ? 180 : 0,
    style: {
      color: 'rgba(0, 0, 0, 0.25)',
    },
  });
</script>
