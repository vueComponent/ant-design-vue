---
category: Components
cols: 1
type: Data Display
title: Table
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3yz3QqMlShYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Sv8XQ50NB40AAAAAAAAAAAAADrJ8AQ/original
---

A table displays rows of data.

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## How To Use

Specify `dataSource` of Table as an array of data.

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
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
          },
          {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
          },
        ],

        columns: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: 'Address',
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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bodyCell | custom body cell by slot | v-slot:bodyCell="{text, record, index, column}" | - | 3.0 |
| bordered | Whether to show all table borders | boolean | `false` |  |
| childrenColumnName | The column contains children to display | string | `children` |  |
| columns | Columns of table [config](#column) | array | - |  |
| components | Override default table elements | object | - |  |
| customFilterDropdown | Customized filter overlay, need set `column.customFilterDropdown` | v-slot:customFilterDropdown="[FilterDropdownProps](#filterdropdownprops)" | - | 3.0 |
| customFilterIcon | Customized filter icon | v-slot:customFilterIcon="{filtered, column}" | - | 3.0 |
| customHeaderRow | Set props on per header row | Function(columns, index) | - |  |
| customRow | Set props on per row | Function(record, index) | - |  |
| dataSource | Data record array to be displayed | any\[] | - |  |
| defaultExpandAllRows | Expand all rows initially | boolean | `false` |  |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - |  |
| emptyText | Customize the display content when empty data | v-slot:emptyText | - | 3.0 |
| expandedRowKeys(v-model) | Current expanded row keys | string\[] | - |  |
| expandedRowRender | Expanded container render for each row | Function({record, index, indent, expanded}):VNode\|v-slot | - |  |
| expandFixed | Set column to be fixed: `true`(same as left) `'left'` `'right'` | boolean \| string | false | 3.0 |
| expandColumnTitle | Set the title of the expand column | v-slot | - | 4.0.0 |
| expandIcon | Customize row expand Icon. | Function(props):VNode \| v-slot:expandIcon="props" | - |  |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | `false` |  |
| footer | Table footer renderer | Function(currentPageData)\| v-slot:footer="currentPageData" |  |  |
| getPopupContainer | the render container of dropdowns in table | (triggerNode) => HTMLElement | `() => TableHtmlElement` | 1.5.0 |
| headerCell | custom head cell by slot | v-slot:headerCell="{title, column}" | - | 3.0 |
| indentSize | Indent size in pixels of tree data | number | 15 |  |
| loading | Loading status of table | boolean\|[object](/components/spin) | `false` |  |
| locale | i18n text including filter, sort, empty text, etc | object | filterConfirm: 'Ok' <br /> filterReset: 'Reset' <br /> emptyText: 'No Data' |  |
| pagination | Config of pagination. You can ref table pagination [config](#pagination) or full [`pagination`](/components/pagination/) document, hide it by setting it to `false` | object \| `false` |  |  |
| rowClassName | Row's className | Function(record, index):string | - |  |
| rowExpandable | Enable row can be expandable | (record) => boolean | - |  |
| rowKey | Row's unique key, could be a string or function that returns a string | string\|Function(record, index):string | `key` |  |
| rowSelection | Row selection [config](#rowselection) | object | null |  |
| scroll | Whether the table can be scrollable, [config](#scroll) | object | - |  |
| showExpandColumn | Show expand column | boolean | true | 3.0 |
| showHeader | Whether to show table header | boolean | `true` |  |
| showSorterTooltip | The header show next sorter direction tooltip. It will be set as the property of Tooltip if its type is object | boolean \| [Tooltip props](/components/tooltip/#api) | true | 3.0 |
| size | Size of table | `middle` \| `small` \| `large` | `large` |  |
| sortDirections | Supported sort way, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] | 3.0 |
| sticky | Set sticky header and scroll bar | boolean \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - | 3.0 |
| summary | Summary content | v-slot:summary | - | 3.0 |
| tableLayout | [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) attribute of table element | - \| 'auto' \| 'fixed' | -<hr />`fixed` when header/columns are fixed, or using `column.ellipsis` | 1.5.0 |
| title | Table title renderer | Function(currentPageData)\| v-slot:title="currentPageData" |  |  |
| transformCellText | The data can be changed again before rendering, generally used for the default configuration of empty data. You can configured globally through [ConfigProvider](/components/config-provider-cn/) | Function({ text, column, record, index }) => any, The `text` here is the data processed by other defined cell api, and it may be of type VNode \| string \| number | - | 1.5.4 ｜ |

### Events

| Events Name | Description | Arguments |  |
| --- | --- | --- | --- |
| change | Callback executed when pagination, filters or sorter is changed | Function(pagination, filters, sorter, { action, currentDataSource }) |  |
| expand | Callback executed when the row expand icon is clicked | Function(expanded, record) |  |
| expandedRowsChange | Callback executed when the expanded rows change | Function(expandedRows) |  |
| resizeColumn | Triggered when the column is dragged | Function(width, column) |  |

#### customRow usage

Same as `customRow` `customHeaderRow` `customCell` `customHeaderCell`. Follow [Vue jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx) syntax。

```jsx
<Table
  customRow={(record) => {
    return {
      xxx, // props
      onClick: (event) => {},       // click row
      onDblclick: (event) => {}, // double click row
      onContextmenu: (event) => {}  // right button click row
      onMouseenter: (event) => {}   // mouse enter row
      onMouseleave: (event) => {}   // mouse leave row
    };
  }}
  customHeaderRow={(columns, index) => {
    return {
      onClick: () => {},        // click header row
    };
  }}
/>
```

### Column

One of the Table `columns` prop for describing the table's columns, Column has the same API.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | specify how content is aligned | 'left' \| 'right' \| 'center' | 'left' |  |
| colSpan | Span of this column's title | number |  |  |
| customCell | Set props on per cell | Function(record, rowIndex, column) | - | column add from 3.0 |
| customFilterDropdown | use v-slot:customFilterDropdown, Priority is lower than filterDropdown | boolean | false | 3.0 |
| customHeaderCell | Set props on per header cell | Function(column) | - |  |
| customRender | Renderer of the table cell. The return value should be a VNode | Function({text, record, index}) {} | - |  |
| dataIndex | Display field of the data record, support nest path by string array | string \| string\[] | - |  |
| defaultFilteredValue | Default filtered values | string\[] | - | 1.5.0 |
| filterResetToDefaultFilteredValue | click the reset button, whether to restore the default filter | boolean | false | 3.3.0 |
| defaultSortOrder | Default order of sorted values: `'ascend'` `'descend'` `null` | string | - |  |
| ellipsis | ellipsize cell content, not working with sorter and filters for now.<br />tableLayout would be `fixed` when `ellipsis` is true. | boolean | false | 1.5.0 |
| ellipsis | The ellipsis cell content, not working with sorter and filters for now.<br />tableLayout would be `fixed` when `ellipsis` is `true` or `{ showTitle?: boolean }` | boolean \| {showTitle?: boolean } | false | 3.0 |
| filterDropdown | Customized filter overlay | VNode \| (props: FilterDropdownProps) => VNode | - |  |
| filterDropdownOpen | Whether `filterDropdown` is open | boolean | - | 4.0 |
| filtered | Whether the `dataSource` is filtered | boolean | `false` |  |
| filteredValue | Controlled filtered value, filter icon will highlight | string\[] | - |  |
| filterIcon | Customized filter icon | ({filtered: boolean, column: Column}) | `false` |  |
| filterMode | To specify the filter interface | 'menu' \| 'tree' | 'menu' | 3.0 |
| filterMultiple | Whether multiple filters can be selected | boolean | `true` |  |
| filters | Filter menu config | object\[] | - |  |
| filterSearch | Whether to be searchable for filter menu | boolean \| function(input, filter):boolean | false | boolean: 3.0 function: 3.3.0 |
| fixed | Set column to be fixed: `true`(same as left) `'left'` `'right'` | boolean\|string | `false` |  |
| key | Unique key of this column, you can ignore this prop if you've set a unique `dataIndex` | string | - |  |
| maxWidth | Drag the maximum width of the column, it will be affected by the automatic adjustment and distribution of the table width | number | - | 3.0 |
| minWidth | Drag the minimum width of the column, it will be affected by the automatic adjustment and distribution of the table width | number | 50 | 3.0 |
| resizable | Whether the width can be adjusted by dragging, at this time width must be number type | boolean | - | 3.0 |
| responsive | The list of breakpoints at which to display this column. Always visible if not set. | [Breakpoint](#breakpoint)\[] | - | 3.0 |
| rowScope | Set scope attribute for all cells in this column | `row` \| `rowgroup` | - | 4.0 |
| sortDirections | supported sort way, could be `'ascend'`, `'descend'` | Array | `['ascend', 'descend']` | 1.5.0 |
| sorter | Sort function for local sort, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction. If you need sort buttons only, set to `true` | Function\|boolean | - |  |
| sortOrder | Order of sorted values: `'ascend'` `'descend'` `null` | string | - |  |
| title | Title of this column | string | - |  |
| width | Width of this column | string\|number | - |  |
| onFilter | Callback executed when the confirm filter button is clicked, Use as a `filter` event when using template or jsx | Function | - |  |
| onFilterDropdownOpenChange | Callback executed when `filterDropdownOpen` is changed, Use as a `filterDropdownOpen` event when using template or jsx | function(open) {} | - | 4.0 |

#### Breakpoint

```ts
type Breakpoint = 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
```

### ColumnGroup

| Property | Description               | Type         | Default |
| -------- | ------------------------- | ------------ | ------- |
| title    | Title of the column group | string\|slot | -       |

### pagination

Properties for pagination.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| position | Specify the position of `Pagination`, could be`topLeft` \| `topCenter` \| `topRight` \|`bottomLeft` \| `bottomCenter` \| `bottomRight` | Array | \[`bottomRight`] |

More about pagination, please check [`Pagination`](/components/pagination/).

### rowSelection

Properties for row selection.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkStrictly | Check table row precisely; parent row and children rows are not associated | boolean | true | 3.0 |
| columnTitle | Set the title of the selection column | string\|VNode | - |  |
| columnWidth | Set the width of the selection column | string\|number | - |  |
| fixed | Fixed selection column on the left | boolean | - |  |
| getCheckboxProps | Get Checkbox or Radio props | Function(record) | - |  |
| hideDefaultSelections | Remove the default `Select All` and `Select Invert` selections | boolean | `false` |  |
| hideSelectAll | Hide the selectAll checkbox and custom selection | boolean | false | 3.0 |
| preserveSelectedRowKeys | Keep selection `key` even when it removed from `dataSource` | boolean | - | 3.0 |
| selectedRowKeys | Controlled selected row keys | string\[] | \[] |  |
| selections | Custom selection [config](#rowselection), only displays default selections when set to `true` | object\[] \| boolean | - |  |
| type | `checkbox` or `radio` | `checkbox` \| `radio` | `checkbox` |  |
| onChange | Callback executed when selected rows change | Function(selectedRowKeys, selectedRows) | - |  |
| onSelect | Callback executed when select/deselect one row | Function(record, selected, selectedRows, nativeEvent) | - |  |
| onSelectAll | Callback executed when select/deselect all rows | Function(selected, selectedRows, changeRows) | - |  |
| onSelectInvert | Callback executed when row selection is inverted | Function(selectedRows) | - |  |
| onSelectNone | Callback executed when row selection is cleared | function() | - | 3.0 |

### scroll

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | Whether to scroll to the top of the table when paging, sorting, filtering changes | boolean | - |
| x | Set horizontal scrolling, can also be used to specify the width of the scroll area, could be number, percent value, true and ['max-content'](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width#max-content) | string \| number \| true | - |
| y | Set vertical scrolling, can also be used to specify the height of the scroll area, could be string or number | string \| number | - |

### selection

Custom selection config

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | string\|VNode | - |
| onSelect | Callback executed when this selection is clicked | Function(changeableRowKeys) | - |

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

## Note

The values inside `dataSource` and `columns` should follow this in Table, and `dataSource[i].key` would be treated as key value default for `dataSource`.

If `dataSource[i].key` is not provided, then you should specify the primary key of dataSource value via `rowKey`. If not, warnings will show in browser console.

```jsx
// primary key is uid
return <Table rowKey="uid" />;
// or
return <Table rowKey={record => record.uid} />;
```

## FAQ

### How to hide pagination when single page or no data?

You can set `hideOnSinglePage` with `pagination` prop.

### Table will return to first page when filter data.

Table total page count usually reduce after filter data, we defaultly return to first page in case of current page is out of filtered results.

### Why Table pagination show size changer?

In order to improve user experience, Pagination show size changer by default when `total > 50` since `3.0`. You can set `showSizeChanger=false` to disable this feature.

### How to handle fixed column display over the mask layout?

Fixed column use `z-index` to make it over other columns. You will find sometime fixed columns also over your mask layout. You can set `z-index` on your mask layout to resolve.
