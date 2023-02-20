<template>
  <demo-sort :cols="1">
    <basic />
    <oneway />
    <search />
    <advanced />
    <custom-item />
    <pagination />
    <table-transfer />
    <tree-transfer />
    <statusVue />
    <custom-select-all-labels></custom-select-all-labels>
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Oneway from './oneway.vue';
import Search from './search.vue';
import Advanced from './advanced.vue';
import CustomItem from './custom-item.vue';
import CustomSelectAllLabels from './custom-select-all-labels.vue';
import TableTransfer from './table-transfer.vue';
import TreeTransfer from './tree-transfer.vue';
import Pagination from './pagination.vue';
import statusVue from './status.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    statusVue,
    Basic,
    Oneway,
    Search,
    Advanced,
    CustomItem,
    CustomSelectAllLabels,
    Pagination,
    TableTransfer,
    TreeTransfer,
  },
  setup() {
    return {};
  },
});
</script>
