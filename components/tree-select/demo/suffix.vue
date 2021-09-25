<template>
  <a-space direction="vertical" style="width: 100%">
    <a-tree-select
      v-model:value="value"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      tree-default-expand-all
      :tree-data="treeData"
    >
      <template #suffixIcon><SmileOutlined /></template>
    </a-tree-select>

    <a-tree-select
      v-model:value="value1"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      multiple
      show-arrow
      tree-default-expand-all
      :tree-data="treeData"
    >
      <template #suffixIcon><SmileOutlined /></template>
    </a-tree-select>
  </a-space>
</template>
<script lang="ts">
import { SmileOutlined } from '@ant-design/icons-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    SmileOutlined,
  },
  setup() {
    const value = ref<string>();
    const value1 = ref<string[]>([]);
    const treeData = ref<TreeSelectProps['treeData']>([
      {
        title: 'parent 1',
        value: 'parent 1',
        children: [
          {
            title: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                title: 'my leaf',
                value: 'leaf1',
              },
              {
                title: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            title: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
    ]);
    watch(value, () => {
      console.log('select', value.value);
    });

    return {
      value,
      value1,
      treeData,
    };
  },
});
</script>
