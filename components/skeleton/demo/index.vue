<template>
  <basic />
  <complex />
  <active />
  <children />
  <list />
  <elementVue />
</template>
<script lang="ts">
import Basic from './basic.vue';
import Complex from './complex.vue';
import Active from './active.vue';
import Children from './children.vue';
import List from './list.vue';
import elementVue from './element.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Complex,
    Active,
    List,
    Children,
    elementVue,
  },
  setup() {
    return {};
  },
});
</script>
