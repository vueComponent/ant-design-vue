<template>
  <demo-sort>
    <basic />
    <fallback />
    <placeholder />
    <preview-group />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Fallback from './fallback.vue';
import Placeholder from './placeholder.vue';
import PreviewGroup from './previewGroup.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Fallback,
    Placeholder,
    PreviewGroup,
  },
});
</script>
<style></style>
