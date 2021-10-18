---
category: Components
type: Data Entry
title: TreeSelect
cover: https://gw.alipayobjects.com/zos/alicdn/Ax4DA0njr/TreeSelect.svg
---

Tree selection control.

## When To Use

`TreeSelect` is similar to `Select`, but the values are provided in a tree like structure. Any data whose entries are defined in a hierarchical manner is fit to use this control. Examples of such case may include a corporate hierarchy, a directory structure, and so on.

## API

### Tree props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- | --- |
| allowClear | Whether allow clear | boolean | false |  |
| defaultValue | To set the initial selected treeNode(s). | string\|string\[] | - |  |
| disabled | Disabled or not | boolean | false |  |
| dropdownClassName | className of dropdown menu | string | - |  |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true |  |
| dropdownStyle | To set the style of the dropdown menu | object | - |  |
| filterTreeNode | Whether to filter treeNodes by input value. The value of `treeNodeFilterProp` is used for filtering by default. | boolean\|Function(inputValue: string, treeNode: TreeNode) (should return boolean) | Function |  |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a `div` element in `body`, you can reset it to the scrolling area and make a relative reposition. | Function(triggerNode) | () => document.body |  |
| labelInValue | whether to embed label in value, turn the format of value from `string` to `{value: string, label: VNode, halfChecked: string[]}` | boolean | false |  |
| loadData | Load data asynchronously. | function(node) | - |  |
| maxTagCount | Max tag count to show | number | - |  |
| maxTagPlaceholder | Placeholder for not showing tags | slot/function(omittedValues) | - |  |
| multiple | Support multiple or not, will be `true` when enable `treeCheckable`. | boolean | false |  |
| placeholder | Placeholder of the select input | string\|slot | - |  |
| searchPlaceholder | Placeholder of the search input | string\|slot | - |  |
| searchValue(v-model) | work with `search` event to make search value controlled. | string | - |  |
| treeIcon | Shows the icon before a TreeNode's title. There is no default style; you must set a custom style for it if set to `true` | boolean | false |  |
| showCheckedStrategy | The way show selected item in box. **Default:** just show child nodes. **`TreeSelect.SHOW_ALL`:** show all checked treeNodes (include parent treeNode). **`TreeSelect.SHOW_PARENT`:** show checked treeNodes (just show parent treeNode). | enum { TreeSelect.SHOW_ALL, TreeSelect.SHOW_PARENT, TreeSelect.SHOW_CHILD } | TreeSelect.SHOW_CHILD |  |
| showSearch | Whether to display a search input in the dropdown menu(valid only in the single mode) | boolean | false |  |
| size | To set the size of the select input, options: `large` `small` | string | 'default' |  |
| suffixIcon | The custom suffix icon | VNode \| slot | - |  |
| treeCheckable | Whether to show checkbox on the treeNodes | boolean | false |  |
| treeCheckStrictly | Whether to check nodes precisely (in the `checkable` mode), means parent and child nodes are not associated, and it will make `labelInValue` be true | boolean | false |  |
| treeData | Data of the treeNodes, manual construction work is no longer needed if this property has been set(ensure the Uniqueness of each value) | array\<{ value, title, children, \[disabled, disableCheckbox, selectable] }> | \[] |  |
| replaceFields | Replace the title,value, key and children fields in treeNode with the corresponding fields in treeData | object | { children:'children', label:'title', key:'key', value: 'value' } |  | 1.6.1 (3.0.0 deprecated) |
| fieldNames | Replace the title,value, key and children fields in treeNode with the corresponding fields in treeData | object | {children:'children', label:'title', key:'key', value: 'value' } |  | 3.0.0 |
| treeDataSimpleMode | Enable simple mode of treeData. Changes the `treeData` schema to: \[{id:1, pId:0, value:'1', title:"test1",...},...] where pId is parent node's id). It is possible to replace the default `id` and `pId` keys by providing object to `treeDataSimpleMode` | false\|object\<{ id: string, pId: string, rootPId: null }> | false |  |
| treeDefaultExpandAll | Whether to expand all treeNodes by default | boolean | false |  |
| treeDefaultExpandedKeys | Default expanded treeNodes | string\[] \| number\[] | - |  |
| treeExpandedKeys(v-model) | Set expanded keys | string\[] \| number\[] | - |  |
| treeNodeFilterProp | Will be used for filtering if `filterTreeNode` returns true | string | 'value' |  |
| treeNodeLabelProp | Will render as content of select | string | 'title' |  |
| value(v-model) | To set the current selected treeNode(s). | string\|string\[] | - |  |
| title | custom title | slot |  | 3.0.0 |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | A callback function, can be executed when selected treeNodes or input value change | function(value, label, extra) |
| search | A callback function, can be executed when the search input changes. | function(value: string) |
| select | A callback function, can be executed when you select a treeNode. | function(value, node, extra) |
| treeExpand | A callback function, can be executed when treeNode expanded | function(expandedKeys) |

### Tree Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

### TreeNode props

> We recommend you to use `treeData` rather than `TreeNode`, to avoid the trouble of manual construction.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| selectable | can be selected | boolean | true |  |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - |  |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false |  |
| disabled | Disabled or not | boolean | false |  |
| isLeaf | Leaf node or not | boolean | false |  |
| key | Required property, should be unique in the tree | string \| number | - |  |
| title | Content showed on the treeNodes | string | '---' |  |
| value | Will be treated as `treeNodeFilterProp` by default, should be unique in the tree | string | - |  |

## FAQ

### How to get parent node in onChange?

We don't provide this since performance consideration.
