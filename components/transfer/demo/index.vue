<template>
  <demo-sort :cols="1">
    <basic />
    <search />
    <advanced />
    <custom-item />
    <table-transfer />
    <tree-transfer />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Search from './search.vue';
import Advanced from './advanced.vue';
import CustomItem from './custom-item.vue';
import TableTransfer from './table-transfer.vue';
import TreeTransfer from './tree-transfer.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Search,
    Advanced,
    CustomItem,
    TableTransfer,
    TreeTransfer,
  },
  setup() {
    return {};
  },
});
</script>
