<docs>
---
order: 3
title:
  zh-CN: 自定义提示
  en-US: Customize tooltip
---

## zh-CN

使用 `tipFormatter` 可以格式化 `Tooltip` 的内容，设置 `tipFormatter={null}`，则隐藏 `Tooltip`。

## en-US

Use `tipFormatter` to format content of `Tooltip`. If `tipFormatter` is null, hide it.
</docs>

<template>
  <div>
    <a-slider :tip-formatter="formatter" />
    <a-slider :tip-formatter="null" />
  </div>
</template>
<script lang="ts" setup>
const formatter = (value: number) => {
  return `${value}%`;
};
</script>
