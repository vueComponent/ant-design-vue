<template>
  <demo-sort>
    <Base />
    <AllowClear />
    <Controlled />
    <Disabled />
    <Format />
    <Presets />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Base from './base.vue';
import AllowClear from './allowClear.vue';
import Controlled from './controlled.vue';
import Disabled from './disabled.vue';
import Format from './format.vue';
import Presets from './presets.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  components: {
    Base,
    AllowClear,
    Controlled,
    Disabled,
    Format,
    Presets,
  },
  setup() {
    return {};
  },
});
</script>
