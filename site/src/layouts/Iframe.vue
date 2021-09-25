<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { defineComponent, provide } from 'vue';
export default defineComponent({
  name: 'IframeLayout',
  setup() {
    provide('inIframe', true);
    return {};
  },
});
</script>
<style lang="less" scoped></style>
