<template>
  <demo-sort>
    <horizontal />
    <with-text />
    <vertical />
    <customize-style />
  </demo-sort>
</template>

<script lang="ts">
import Horizontal from './horizontal.vue';
import WithText from './with-text.vue';
import Vertical from './vertical.vue';
import CustomizeStyle from './customize-style.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Horizontal,
    WithText,
    Vertical,
    CustomizeStyle,
  },
  setup() {
    return {};
  },
});
</script>
