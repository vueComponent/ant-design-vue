<docs>
---
order: 4
title:
  zh-CN: 省略号
  en-US: Ellipsis
---

## zh-CN

多行文本省略。你可以通过 `tooltip` 属性配置省略展示内容，大量文本时推荐优先使用 `expandable`。

## en-US

Multiple line ellipsis support. You can use `tooltip` to config ellipsis tooltip. Recommend `expandable` when have lots of content.
</docs>
<template>
  <a-switch v-model:checked="ellipsis" />
  <a-typography-paragraph
    :ellipsis="ellipsis"
    content=" Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team."
  />

  <a-typography-paragraph
    :ellipsis="ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false"
    content="Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team."
  />

  <a-typography-text
    :style="ellipsis ? { width: '100px' } : {}"
    :ellipsis="ellipsis ? { tooltip: 'I am ellipsis now!' } : false"
    content="Ant Design, a design language for background applications, is refined by Ant UED Team."
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const ellipsis = ref(true);
</script>
