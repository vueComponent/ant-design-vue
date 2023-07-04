<template>
  <demo-sort>
    <basic />
    <local />
    <icon />
    <placement />
    <dynamic-trigger />
    <promiseVue />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Local from './local.vue';
import Icon from './icon.vue';
import Placement from './placement.vue';
import DynamicTrigger from './dynamic-trigger.vue';
import promiseVue from './promise.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    promiseVue,
    Basic,
    Local,
    Icon,
    Placement,
    DynamicTrigger,
  },
  setup() {
    return {};
  },
});
</script>
