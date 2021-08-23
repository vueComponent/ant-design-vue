<template>
  <a-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    multiple
    tree-default-expand-all
  >
    <a-tree-select-node value="parent 1" title="parent 1">
      <a-tree-select-node value="parent 1-0" title="parent 1-0">
        <a-tree-select-node value="leaf1" title="my leaf" />
        <a-tree-select-node value="leaf2" title="your leaf" />
      </a-tree-select-node>
      <a-tree-select-node value="parent 1-1" title="parent 1-1">
        <a-tree-select-node value="sss">
          <template #title><b style="color: #08c">sss</b></template>
        </a-tree-select-node>
      </a-tree-select-node>
    </a-tree-select-node>
  </a-tree-select>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  setup() {
    const value = ref<string[]>([]);

    watch(value, () => {
      console.log('select', value.value);
    });

    return {
      value,
    };
  },
});
</script>
