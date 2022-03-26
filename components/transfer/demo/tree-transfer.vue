<docs>
---
order: 7
title:
  zh-CN: 树穿梭框
  en-US: Tree Transfer
---

## zh-CN

使用 Tree 组件作为自定义渲染列表。

## en-US

Customize render list with Tree component.

</docs>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      class="tree-transfer"
      :data-source="dataSource"
      :render="item => item.title"
      :show-select-all="false"
    >
      <template #children="{ direction, selectedKeys, onItemSelect }">
        <a-tree
          v-if="direction === 'left'"
          block-node
          checkable
          check-strictly
          default-expand-all
          :checked-keys="[...selectedKeys, ...targetKeys]"
          :tree-data="treeData"
          @check="
            (_, props) => {
              onChecked(props, [...selectedKeys, ...targetKeys], onItemSelect);
            }
          "
          @select="
            (_, props) => {
              onChecked(props, [...selectedKeys, ...targetKeys], onItemSelect);
            }
          "
        />
      </template>
    </a-transfer>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { TransferProps, TreeProps } from 'ant-design-vue';
const tData: TransferProps['dataSource'] = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' },
    ],
  },
  { key: '0-2', title: '0-3' },
];

const transferDataSource: TransferProps['dataSource'] = [];
function flatten(list: TransferProps['dataSource'] = []) {
  list.forEach(item => {
    transferDataSource.push(item);
    flatten(item.children);
  });
}
flatten(JSON.parse(JSON.stringify(tData)));

function isChecked(selectedKeys: (string | number)[], eventKey: string | number) {
  return selectedKeys.indexOf(eventKey) !== -1;
}

function handleTreeData(data: TransferProps['dataSource'], targetKeys: string[] = []) {
  data.forEach(item => {
    item['disabled'] = targetKeys.includes(item.key as any);
    if (item.children) {
      handleTreeData(item.children, targetKeys);
    }
  });
  return data as TreeProps['treeData'];
}

export default defineComponent({
  setup() {
    const targetKeys = ref<string[]>([]);

    const dataSource = ref(transferDataSource);

    const treeData = computed(() => {
      return handleTreeData(tData, targetKeys.value);
    });

    const onChecked = (
      e: Parameters<TreeProps['onCheck']>[1] | Parameters<TreeProps['onSelect']>[1],
      checkedKeys: string[],
      onItemSelect: (n: any, c: boolean) => void,
    ) => {
      const { eventKey } = e.node;
      onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
    };
    return {
      targetKeys,
      dataSource,
      treeData,
      onChecked,
    };
  },
});
</script>
<style scoped>
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
</style>
