<docs>
---
order: 1
title:
  zh-CN: 适应文本高度的文本域
  en-US: Autosizing the height to fit the content
---

## zh-CN

属性适用于 `textarea` 节点，并且只有高度会自动变化。另外 `autoSize` 可以设定为一个对象，指定最小行数和最大行数。
> `1.5.0` 后 `autosize` 被废弃，请使用 `autoSize`。

## en-US

`autoSize` prop for a `textarea` type of `Input` makes the height to automatically adjust based on the content. An options object can be provided to `autoSize` to specify the minimum and maximum number of lines the textarea will automatically adjust.
> `autosize` is deprecated after `1.5.0`, please use `autoSize`.

</docs>
<template>
  <div>
    <a-textarea
      v-model:value="value1"
      placeholder="Autosize height based on content lines"
      auto-size
    />
    <div style="margin: 24px 0" />
    <a-textarea
      v-model:value="value2"
      placeholder="Autosize height with minimum and maximum number of lines"
      :auto-size="{ minRows: 2, maxRows: 5 }"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<string>('');
const value2 = ref<string>('');
</script>
