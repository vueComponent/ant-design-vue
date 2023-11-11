<template>
  <demo-sort :cols="1">
    <Basic />
    <Align />
    <Gap />
    <Wrap />
    <Combination />
  </demo-sort>
</template>
<script lang="ts">
import Align from './align.vue';
import Basic from './basic.vue';
import Combination from './combination.vue';
import Gap from './gap.vue';
import Wrap from './wrap.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Align,
    Basic,
    Combination,
    Gap,
    Wrap,
  },
});
</script>
