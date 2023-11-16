<template>
  <demo-sort>
    <basic />
    <fallback />
    <placeholder />
    <preview-group />
    <previewGroupVisibleVue />
    <previewSrc />
    <controlled-preview />
    <toolbar-render />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Fallback from './fallback.vue';
import Placeholder from './placeholder.vue';
import previewSrc from './preview-src.vue';
import PreviewGroup from './preview-group.vue';
import ControlledPreview from './controlled-preview.vue';
import previewGroupVisibleVue from './preview-group-visible.vue';
import ToolbarRender from './toolbar-render.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Fallback,
    previewSrc,
    Placeholder,
    PreviewGroup,
    ControlledPreview,
    previewGroupVisibleVue,
    ToolbarRender,
  },
});
</script>
<style></style>
