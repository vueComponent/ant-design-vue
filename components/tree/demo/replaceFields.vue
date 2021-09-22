<docs>
---
order: 9
title:
  zh-CN: 自定义字段
  en-US: ReplaceFields
---

## zh-CN

替换treeNode中 title,key,children字段为treeData中对应的字段

## en-US

Replace the title,key and children fields in treeNode with the corresponding fields in treeData.

</docs>

<template>
  <a-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    v-model:checkedKeys="checkedKeys"
    checkable
    :tree-data="treeData"
    :field-names="fieldNames"
  >
    <template #title="{ name, key }">
      <span v-if="key === '0-0-1'" style="color: #1890ff">{{ name }}</span>
      <template v-else>{{ name }}</template>
    </template>
  </a-tree>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { TreeProps } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);

    const fieldNames: TreeProps['fieldNames'] = {
      children: 'child',
      title: 'name',
    };

    const treeData: TreeProps['treeData'] = [
      {
        name: 'parent 1',
        key: '0-0',
        child: [
          {
            name: '张晨成',
            key: '0-0-0',
            disabled: true,
            child: [
              { name: 'leaf', key: '0-0-0-0', disableCheckbox: true },
              { name: 'leaf', key: '0-0-0-1' },
            ],
          },
          {
            name: 'parent 1-1',
            key: '0-0-1',
            child: [{ key: '0-0-1-0', name: 'zcvc' }],
          },
        ],
      },
    ];
    watch(expandedKeys, () => {
      console.log('expandedKeys', expandedKeys);
    });
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
    });
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys);
    });
    return {
      expandedKeys,
      selectedKeys,
      checkedKeys,
      fieldNames,
      treeData: ref(treeData),
    };
  },
});
</script>
