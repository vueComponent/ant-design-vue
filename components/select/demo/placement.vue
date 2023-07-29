<docs>
---
order: 28
title:
  zh-CN: 弹出位置
  en-US: Popup Placement
---

## zh-CN

可以通过 `placement` 手动指定弹出的位置。

## en-US

You can manually specify the position of the popup via `placement`.

</docs>

<template>
  <a-radio-group v-model:value="placement">
    <a-radio-button value="topLeft">topLeft</a-radio-button>
    <a-radio-button value="topRight">topRight</a-radio-button>
    <a-radio-button value="bottomLeft">bottomLeft</a-radio-button>
    <a-radio-button value="bottomRight">bottomRight</a-radio-button>
  </a-radio-group>
  <br />
  <br />
  <a-select
    v-model:value="value"
    style="width: 120px"
    :dropdown-match-select-width="false"
    :placement="placement"
  >
    <a-select-option value="HangZhou">HangZhou #310000</a-select-option>
    <a-select-option value="NingBo">NingBo #315000</a-select-option>
    <a-select-option value="WenZhou">WenZhou #325000</a-select-option>
  </a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const placement = ref('topLeft' as const);
const value = ref('HangZhou');
</script>
