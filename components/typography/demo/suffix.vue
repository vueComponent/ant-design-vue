<docs>
---
order: 100
title:
  zh-CN: 后缀
  en-US: suffix
---

## zh-CN

添加后缀的省略。

## en-US

add suffix ellipsis support.
</docs>
<template>
  <a-slider v-model:value="rows" :min="1" :max="10" />
  <a-typography-paragraph
    :ellipsis="ellipsis"
    :title="`${article}--William Shakespeare`"
    :content="article"
  ></a-typography-paragraph>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
const rows = ref(1);
const ellipsis = computed(() => {
  return {
    rows: rows.value,
    expandable: true,
    suffix: '--William Shakespeare',
    onEllipsis: (ellipsis: boolean) => {
      console.log('Ellipsis changed:', ellipsis);
    },
  };
});

const article =
  "To be, or not to be, that is a question: Whether it is nobler in the mind to suffer. The slings and arrows of outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. There 's the respect That makes calamity of so long life";
</script>
