<template>
  <demo-sort>
    <basic />
    <multiple />
    <!-- <tree-data /> -->
    <checkable />
    <suffix />
    <async />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Multiple from './multiple.vue';
// import TreeData from './treeData.vue';
import Checkable from './checkable.vue';
import Suffix from './suffix.vue';
import Async from './async.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Multiple,
    // TreeData,
    Checkable,
    Suffix,
    Async,
  },
  setup() {
    return {};
  },
});
</script>
