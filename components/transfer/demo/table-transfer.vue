<docs>
---
order: 6
title:
  zh-CN: 表格穿梭框
  en-US: Table Transfer
---

## zh-CN

使用 Table 组件作为自定义渲染列表。

## en-US

Customize render list with Table component.

</docs>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      :data-source="mockData"
      :disabled="disabled"
      :show-search="showSearch"
      :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
      :show-select-all="false"
      @change="onChange"
    >
      <template
        #children="{
          direction,
          filteredItems,
          selectedKeys,
          disabled: listDisabled,
          onItemSelectAll,
          onItemSelect,
        }"
      >
        <a-table
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys,
              onItemSelectAll,
              onItemSelect,
            })
          "
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :data-source="filteredItems"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
          :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !selectedKeys.includes(key));
              },
            })
          "
        />
      </template>
    </a-transfer>
    <a-switch
      v-model:checked="disabled"
      un-checked-children="disabled"
      checked-children="disabled"
      style="margin-top: 16px"
    />
    <a-switch
      v-model:checked="showSearch"
      un-checked-children="showSearch"
      checked-children="showSearch"
      style="margin-top: 16px"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface MockData {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}
type tableColumn = Record<string, string>;
const mockData: MockData[] = [];
for (let i = 0; i < 10; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 4 === 0,
  });
}

const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
  },
  {
    dataIndex: 'description',
    title: 'Description',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
  },
];

const targetKeys = ref<string[]>(originTargetKeys);
const disabled = ref<boolean>(false);
const showSearch = ref<boolean>(false);
const leftColumns = ref<tableColumn[]>(leftTableColumns);
const rightColumns = ref<tableColumn[]>(rightTableColumns);

const onChange = (nextTargetKeys: string[]) => {
  console.log('nextTargetKeys', nextTargetKeys);
};

const getRowSelection = ({
  disabled,
  selectedKeys,
  onItemSelectAll,
  onItemSelect,
}: Record<string, any>) => {
  return {
    getCheckboxProps: (item: Record<string, string | boolean>) => ({
      disabled: disabled || item.disabled,
    }),
    onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
      const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
      onItemSelectAll(treeSelectedKeys, selected);
    },
    onSelect({ key }: Record<string, string>, selected: boolean) {
      onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
  };
};
</script>
