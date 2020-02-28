<cn>
#### 表格穿梭框
使用 Table 组件作为自定义渲染列表。
</cn>

<us>
#### Table Transfer
Customize render list with Table component.
</us>

```tpl
<template>
  <div>
    <a-transfer
      :dataSource="mockData"
      :targetKeys="targetKeys"
      :disabled="disabled"
      :showSearch="showSearch"
      @change="onChange"
      :filterOption="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
      :leftColumns="leftColumns"
      :rightColumns="rightColumns"
      :showSelectAll="false"
    >
      <template
        slot="children"
        slot-scope="{
          props: {
            direction,
            filteredItems,
            selectedKeys,
            disabled: listDisabled
          }, on: {
            itemSelectAll,
            itemSelect,
          }
        }"
      >
        <a-table
          :rowSelection="getRowSelection({disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect})"
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :dataSource="filteredItems"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
          :customRow="({ key, disabled: itemDisabled }) => ({
            on: {
              click: () => {
                if (itemDisabled || listDisabled) return;
                itemSelect(key, !selectedKeys.includes(key));
              }
            }
          })"
        />
      </template>
    </a-transfer>
    <a-switch
      unCheckedChildren="disabled"
      checkedChildren="disabled"
      :checked="disabled"
      @change="triggerDisable"
      style="margin-top: 16px"
    />
    <a-switch
      unCheckedChildren="showSearch"
      checkedChildren="showSearch"
      :checked="showSearch"
      @change="triggerShowSearch"
      style="margin-top: 16px"
    />
  </div>
</template>
<script>
import Vue from 'vue';
import difference from 'lodash/difference';
import { Table } from 'ant-design-vue';
import 'ant-design-vue/table/style';
Vue.use(Table);
const mockData = [];
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
    dataIndex: 'tag',
    title: 'Tag',
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

export default {
  data() {
    return {
      mockData,
      targetKeys: originTargetKeys,
      disabled: false,
      showSearch: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
    };
  },
  methods: {
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },

    triggerDisable(disabled) {
      this.disabled = disabled;
    },

    triggerShowSearch(showSearch) {
      this.showSearch = showSearch;
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
  },
};
</script>
```
