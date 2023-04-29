<docs>
---
order: 6
title:
  zh-CN: 单选组合 - 配合 name 使用
  en-US: Radio.Group with name
---

## zh-CN

可以为 Radio.Group 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 Radio.Group 下的 Radio 真正看作是一组（例如可以通过方向键始终**在同一组内**更改选项）。

## en-US

Passing the `name` property to all `input[type="radio"]` that are in the same Radio.Group. It is usually used to let the browser see your Radio.Group as a real "group" and keep the default behavior. For example, using left/right keyboard arrow to change your selection that in the same Radio.Group.

</docs>
<template>
  <a-radio-group v-model:value="value" name="radioGroup">
    <a-radio value="1">A</a-radio>
    <a-radio value="2">B</a-radio>
    <a-radio value="3">C</a-radio>
    <a-radio value="4">D</a-radio>
  </a-radio-group>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('1');
</script>
