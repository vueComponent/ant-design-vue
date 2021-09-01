<template>
  <demo-sort :cols="1">
    <Base />
    <Customize />
    <Vertical />
    <Align />
  </demo-sort>
</template>
<script lang="ts">
import Base from './base.vue';
import Customize from './customize.vue';
import Vertical from './vertical.vue';
import Align from './align.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Base,
    Customize,
    Vertical,
    Align,
  },
  setup() {
    return {};
  },
});
</script>
