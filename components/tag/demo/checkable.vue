<docs>
---
order: 1
title:
  zh-CN: 可选择标签
  en-US: Checkable
---

## zh-CN

可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。
> 该组件为完全受控组件，不支持非受控用法。

## en-US

`CheckableTag` works like Checkbox, click it to toggle checked state.
> it is an absolute controlled component and has no uncontrolled mode.

</docs>

<template>
  <span style="margin-right: 8px">Categories:</span>
  <a-space :size="[0, 8]" wrap>
    <a-checkable-tag
      v-for="(tag, index) in tagsData"
      :key="tag"
      v-model:checked="selectTags[index]"
      @change="checked => handleChange(tag, checked)"
    >
      {{ tag }}
    </a-checkable-tag>
  </a-space>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
const tagsData = reactive(['Movies', 'Books', 'Music', 'Sports']);
const selectTags = reactive([false, true, false, false]);
const handleChange = (tag: string, checked: boolean) => {
  console.log(tag, checked);
};
</script>
