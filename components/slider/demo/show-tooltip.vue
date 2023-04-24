<docs>
---
order: 7
title:
  zh-CN: 控制 ToolTip 的显示
  en-US: Control visible of ToolTip
---

## zh-CN

当 `tooltipOpen` 为 `true` 时，将始终显示 ToolTip；反之则始终不显示，即使在拖动、移入时也是如此。

## en-US

When `tooltipOpen` is `true`, ToolTip will show always, or ToolTip will not show anyway, even if dragging or hovering.
</docs>

<template>
  <a-slider v-model:value="value" :tooltip-open="true" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(30);
</script>
