<docs>
---
order: 4
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
      :data-source="mockData"
      :target-keys="targetKeys"
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
      un-checked-children="disabled"
      checked-children="disabled"
      v-model:checked="disabled"
      style="margin-top: 16px"
    />
    <a-switch
      un-checked-children="showSearch"
      checked-children="showSearch"
      v-model:checked="showSearch"
      style="margin-top: 16px"
    />
  </div>
</template>
<script lang="ts">
import { difference } from 'lodash-es';
import { defineComponent, ref } from 'vue';
interface MockData {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}
type tableColumn = Record<string, string>;
const mockData: MockData[] = [];
for (let i = 0; i < 20; i++) {
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

export default defineComponent({
  setup() {
    const targetKeys = ref<string[]>(originTargetKeys);
    const disabled = ref<boolean>(false);
    const showSearch = ref<boolean>(false);
    const leftColumns = ref<tableColumn[]>(leftTableColumns);
    const rightColumns = ref<tableColumn[]>(rightTableColumns);

    const onChange = (nextTargetKeys: string[]) => {
      targetKeys.value = nextTargetKeys;
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
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }: Record<string, string>, selected: boolean) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    };
    return {
      mockData,
      targetKeys,
      disabled,
      showSearch,
      leftColumns,
      rightColumns,
      onChange,
      getRowSelection,
    };
  },
});
</script>
