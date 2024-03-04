---
category: Components
cols: 1
type: 数据展示
title: Table
subtitle: 表格
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3yz3QqMlShYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Sv8XQ50NB40AAAAAAAAAAAAADrJ8AQ/original
---

展示行列数据。

## 设计师专属

安装 [Kitchen Sketch 插件 💎](https://kitchen.alipay.com/)，两步就可以自动生成 Ant Design 表格组件。

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 如何使用

指定表格的数据源 `dataSource` 为一个数组。

```html
<template>
  <a-table :dataSource="dataSource" :columns="columns" />
</template>
<script>
  export default {
    setup() {
      return {
        dataSource: [
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          },
        ],

        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
          },
        ],
      };
    },
  };
</script>
```

## API

### Table

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bodyCell | 个性化单元格 | v-slot:bodyCell="{text, record, index, column}" | - | 3.0 |
| bordered | 是否展示外边框和列边框 | boolean | false |  |
| childrenColumnName | 指定树形结构的列名 | string | `children` |  |
| columns | 表格列的配置描述，具体项见[下表](#column) | array | - |  |
| components | 覆盖默认的 table 元素 | object | - |  |
| customFilterDropdown | 自定义筛选菜单，需要配合 `column.customFilterDropdown` 使用 | v-slot:customFilterDropdown="[FilterDropdownProps](#filterdropdownprops)" | - | 3.0 |
| customFilterIcon | 自定义筛选图标 | v-slot:customFilterIcon="{filtered, column}" | - | 3.0 |
| customHeaderRow | 设置头部行属性 | Function(columns, index) | - |  |
| customRow | 设置行属性 | Function(record, index) | - |  |
| dataSource | 数据数组 | object\[] |  |  |
| defaultExpandAllRows | 初始时，是否展开所有行 | boolean | false |  |
| defaultExpandedRowKeys | 默认展开的行 | string\[] | - |  |
| emptyText | 自定义空数据时的显示内容 | v-slot:emptyText | - | 3.0 |
| expandedRowKeys(v-model) | 展开的行，控制属性 | string\[] | - |  |
| expandedRowRender | 额外的展开行 | Function(record, index, indent, expanded):VNode \| v-slot:expandedRowRender="{record, index, indent, expanded}" | - |  |
| expandFixed | 控制展开图标是否固定，可选 true `left` `right` | boolean \| string | false | 3.0 |
| expandColumnTitle | 自定义展开列表头 | v-slot | - | 4.0.0 |
| expandIcon | 自定义展开图标 | Function(props):VNode \| v-slot:expandIcon="props" | - |  |
| expandRowByClick | 通过点击行来展开子行 | boolean | `false` |  |
| footer | 表格尾部 | Function(currentPageData)\|v-slot:footer="currentPageData" |  |  |
| getPopupContainer | 设置表格内各类浮层的渲染节点，如筛选菜单 | (triggerNode) => HTMLElement | `() => TableHtmlElement` | 1.5.0 |
| headerCell | 个性化头部单元格 | v-slot:headerCell="{title, column}" | - | 3.0 |
| indentSize | 展示树形数据时，每层缩进的宽度，以 px 为单位 | number | 15 |  |
| loading | 页面是否加载中 | boolean\|[object](/components/spin-cn) | false |  |
| locale | 默认文案设置，目前包括排序、过滤、空数据文案 | object | filterConfirm: `确定` <br> filterReset: `重置` <br> emptyText: `暂无数据` |  |
| pagination | 分页器，参考[配置项](#pagination)或 [pagination](/components/pagination-cn/)文档，设为 false 时不展示和进行分页 | object \| `false` |  |  |
| rowClassName | 表格行的类名 | Function(record, index):string | - |  |
| rowExpandable | 设置是否允许行展开 | (record) => boolean | - | 3.0 |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string\|Function(record):string | 'key' |  |
| rowSelection | 列表项是否可选择，[配置项](#rowselection) | object | null |  |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll) | object | - |  |
| showExpandColumn | 设置是否展示行展开列 | boolean | true | 3.0 |
| showHeader | 是否显示表头 | boolean | true |  |
| showSorterTooltip | 表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性 | boolean \| [Tooltip props](/components/tooltip/) | true | 3.0 |
| size | 表格大小 | `large` \| `middle` \| `small` | `large` |  |
| sortDirections | 支持的排序方式，取值为 `ascend` `descend` | Array | \[`ascend`, `descend`] |  |
| sticky | 设置粘性头部和滚动条 | boolean \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - | 3.0 |
| summary | 总结栏 | v-slot:summary | - | 3.0 |
| tableLayout | 表格元素的 [table-layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout) 属性，设为 `fixed` 表示内容不会影响列的布局 | - \| 'auto' \| 'fixed' | 无<hr />固定表头/列或使用了 `column.ellipsis` 时，默认值为 `fixed` | 1.5.0 |
| title | 表格标题 | Function(currentPageData)\|v-slot:title="currentPageData" |  |  |
| transformCellText | 数据渲染前可以再次改变，一般用于空数据的默认配置，可以通过 [ConfigProvider](/components/config-provider-cn/) 全局统一配置 | Function({ text, column, record, index }) => any，此处的 text 是经过其它定义单元格 api 处理后的数据，有可能是 VNode \| string \| number 类型 | - | 1.5.4 |

### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 分页、排序、筛选变化时触发 | Function(pagination, filters, sorter, { action, currentDataSource }) |
| expand | 点击展开图标时触发 | Function(expanded, record) |
| expandedRowsChange | 展开的行变化时触发 | Function(expandedRows) |
| resizeColumn | 拖动列时触发 | Function(width, column) |

#### customRow 用法

适用于 `customRow` `customHeaderRow` `customCell` `customHeaderCell`。遵循[Vue jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)语法。

```jsx
<Table
  customRow={(record) => {
    return {
      xxx... //属性
      onClick: (event) => {},       // 点击行
      onDblclick: (event) => {},
      onContextmenu: (event) => {},
      onMouseenter: (event) => {},  // 鼠标移入行
      onMouseleave: (event) => {}
    };
  }}
  customHeaderRow={(columns, index) => {
    return {
      onClick: () => {},        // 点击表头行
    };
  }}
/>
```

### Column

列描述数据对象，是 columns 中的一项，Column 使用相同的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 设置列的对齐方式 | `left` \| `right` \| `center` | `left` |  |
| colSpan | 表头列合并,设置为 0 时，不渲染 | number |  |  |
| customCell | 设置单元格属性 | Function(record, rowIndex, column) | - | column add from 3.0 |
| customFilterDropdown | 启用 v-slot:customFilterDropdown，优先级低于 filterDropdown | boolean | false | 3.0 |
| customHeaderCell | 设置头部单元格属性 | Function(column) | - |  |
| customRender | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引 | Function({text, record, index, column}) {} | - |  |
| dataIndex | 列数据在数据项中对应的路径，支持通过数组查询嵌套路径 | string \| string\[] | - |  |
| defaultFilteredValue | 默认筛选值 | string\[] | - | 1.5.0 |
| filterResetToDefaultFilteredValue | 点击重置按钮的时候，是否恢复默认筛选值 | boolean | false | 3.3.0 |
| defaultSortOrder | 默认排序顺序 | `ascend` \| `descend` | - |  |
| ellipsis | 超过宽度将自动省略，暂不支持和排序筛选一起使用。<br />设置为 `true` 或 `{ showTitle?: boolean }` 时，表格布局将变成 `tableLayout="fixed"`。 | boolean \| { showTitle?: boolean } | false | 3.0 |
| filterDropdown | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互 | VNode \| (props: FilterDropdownProps) => VNode | - |  |
| filterDropdownOpen | 用于控制自定义筛选菜单是否可见 | boolean | - |  |
| filtered | 标识数据是否经过过滤，筛选图标会高亮 | boolean | false |  |
| filteredValue | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组 | string\[] | - |  |
| filterIcon | 自定义 filter 图标。 | VNode \| ({filtered: boolean, column: Column}) => vNode | false |  |
| filterMode | 指定筛选菜单的用户界面 | 'menu' \| 'tree' | 'menu' | 3.0 |
| filterMultiple | 是否多选 | boolean | true |  |
| filters | 表头的筛选菜单项 | object\[] | - |  |
| filterSearch | 筛选菜单项是否可搜索 | boolean \| function(input, filter):boolean | false | boolean:3.0 function:3.3.0 |
| fixed | 列是否固定，可选 `true`(等效于 left) `'left'` `'right'` | boolean\|string | false |  |
| key | Vue 需要的 key，如果已经设置了唯一的 `dataIndex`，可以忽略这个属性 | string | - |  |
| maxWidth | 拖动列最大宽度，会受到表格自动调整分配宽度影响 | number | - | 3.0 |
| minWidth | 拖动列最小宽度，会受到表格自动调整分配宽度影响 | number | 50 | 3.0 |
| resizable | 是否可拖动调整宽度，此时 width 必须是 number 类型 | boolean | - | 3.0 |
| responsive | 响应式 breakpoint 配置列表。未设置则始终可见。 | [Breakpoint](#breakpoint)\[] | - | 3.0 |
| rowScope | 设置列范围 | `row` \| `rowgroup` | - | 4.0 |
| showSorterTooltip | 表头显示下一次排序的 tooltip 提示, 覆盖 table 中 `showSorterTooltip` | boolean \| [Tooltip props](/components/tooltip/#api) | true |  |
| sortDirections | 支持的排序方式，取值为 `'ascend'` `'descend'` | Array | `['ascend', 'descend']` | 1.5.0 |
| sorter | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)，需要服务端排序可设为 true | Function\|boolean | - |  |
| sortOrder | 排序的受控属性，外界可用此控制列的排序，可设置为 `'ascend'` `'descend'` `null` | string | - |  |
| title | 列头显示文字 | string | - |  |
| width | 列宽度 | string\|number | - |  |
| onFilter | 本地模式下，确定筛选的运行函数, 使用 template 或 jsx 时作为`filter`事件使用 | Function | - |  |
| onFilterDropdownOpenChange | 自定义筛选菜单可见变化时调用，使用 template 或 jsx 时作为`filterDropdownOpenChange`事件使用 | function(open) {} | - | 4.0 |

#### Breakpoint

```ts
type Breakpoint = 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
```

### ColumnGroup

| 参数  | 说明         | 类型         | 默认值 |
| ----- | ------------ | ------------ | ------ |
| title | 列头显示文字 | string\|slot | -      |

### pagination

分页的配置项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 指定分页显示的位置， 取值为`topLeft` \| `topCenter` \| `topRight` \|`bottomLeft` \| `bottomCenter` \| `bottomRight` | Array | \[`bottomRight`] |

更多配置项，请查看 [`Pagination`](/components/pagination/)。

### rowSelection

选择功能的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checkStrictly | checkable 状态下节点选择完全受控（父子数据选中状态不再关联） | boolean | true | 3.0 |
| columnTitle | 自定义列表选择框标题 | string\|VNode | - |  |
| columnWidth | 自定义列表选择框宽度 | string\|number | - |  |
| fixed | 把选择框列固定在左边 | boolean | - |  |
| getCheckboxProps | 选择框的默认属性配置 | Function(record) | - |  |
| hideDefaultSelections | 去掉『全选』『反选』两个默认选项 | boolean | false |  |
| hideSelectAll | 隐藏全选勾选框与自定义选择项 | boolean | false | 3.0 |
| preserveSelectedRowKeys | 当数据被删除时仍然保留选项的 `key` | boolean | - | 3.0 |
| selectedRowKeys | 指定选中项的 key 数组，需要和 onChange 进行配合 | string\[] | \[] |  |
| selections | 自定义选择项 [配置项](#selection), 设为 `true` 时使用默认选择项 | object\[] \| boolean | true |  |
| type | 多选/单选，`checkbox` or `radio` | string | `checkbox` |  |
| onChange | 选中项发生变化时的回调 | Function(selectedRowKeys, selectedRows) | - |  |
| onSelect | 用户手动选择/取消选择某列的回调 | Function(record, selected, selectedRows, nativeEvent) | - |  |
| onSelectAll | 用户手动选择/取消选择所有列的回调 | Function(selected, selectedRows, changeRows) | - |  |
| onSelectInvert | 用户手动选择反选的回调 | Function(selectedRows) | - |  |
| onSelectNone | 用户清空选择的回调 | function() | - | 3.0 |

### scroll

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否滚动到表格顶部 | boolean | - |
| x | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 ['max-content'](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width#max-content) | string \| number \| true | - |
| y | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | string \| number | - |

### selection

自定义选择配置项

| 参数     | 说明                     | 类型                        | 默认值 |
| -------- | ------------------------ | --------------------------- | ------ |
| key      | Vue 需要的 key，建议设置 | string                      | -      |
| text     | 选择项显示的文字         | string\|VNode               | -      |
| onSelect | 选择项点击回调           | Function(changeableRowKeys) | -      |

### FilterDropdownProps

```ts
interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: Key[]) => void;
  selectedKeys: Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: (param?: FilterResetProps) => void;
  filters?: ColumnFilterItem[];
  visible: boolean;
  column: ColumnType;
}

interface FilterConfirmProps {
  closeDropdown: boolean;
}

interface FilterResetProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}
```

## 注意

在 Table 中，`dataSource` 和 `columns` 里的数据值都需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。若没有指定，控制台会出现缺少 key 的提示，表格组件也会出现各类奇怪的错误。

```jsx
// 比如你的数据主键是 uid
return <Table rowKey="uid" />;
// 或
return <Table rowKey={record => record.uid} />;
```

## FAQ

### 如何在没有数据或只有一页数据时隐藏分页栏

你可以设置 `pagination` 的 `hideOnSinglePage` 属性为 `true`。

### 表格过滤时会回到第一页？

前端过滤时通常条目总数会减少，从而导致总页数小于筛选前的当前页数，为了防止当前页面没有数据，我们默认会返回第一页。

如果你在使用远程分页，很可能需要保持当前页面，你可以手动控制当前页面不变。

### 表格分页为何会出现 size 切换器？

自 `3.0` 起，Pagination 在 `total` 大于 50 条时会默认显示 size 切换器以提升用户交互体验。如果你不需要该功能，可以通过设置 `showSizeChanger` 为 `false` 来关闭。

### 固定列穿透到最上层该怎么办？

固定列通过 `z-index` 属性将其悬浮于非固定列之上，这使得有时候你会发现在 Table 上放置遮罩层时固定列会被透过的情况。为遮罩层设置更高的 `z-index` 覆盖住固定列即可。
