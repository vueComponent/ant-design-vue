<template>
  <demo-sort>
    <Base />
    <AllowClear />
  </demo-sort>
</template>

<script lang="ts">
import Base from './base.vue';
import AllowClear from './allowClear.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Base,
    AllowClear,
  },
  setup() {
    return {};
  },
});
</script>
