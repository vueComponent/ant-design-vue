---
category: Components
type: Data Display
title: Tree
cover: https://gw.alipayobjects.com/zos/alicdn/Xh-oWqg9k/Tree.svg
---

A hierarchical list structure component.

## When To Use

Almost anything can be represented in a tree structure. Examples include directories, organization hierarchies, biological classifications, countries, etc. The `Tree` component is a way of representing the hierarchical relationship between these things. You can also expand, collapse, and select a treeNode within a `Tree`.

## API

### Tree props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| treeData | treeNode of tree, please use `treeNodes` before v1.1.4 | [TreeNode[]](#TreeNode) | - |  |
| replaceFields | Replace the title,key and children fields in treeNode with the corresponding fields in treeData | object | { children:'children', title:'title', key:'key' } |  |
| autoExpandParent | Whether to automatically expand a parent treeNode | boolean | true |  |
| blockNode | Whether treeNode fill remaining horizontal space | boolean | false |  |
| checkable | Adds a `Checkbox` before the treeNodes | boolean | false |  |
| checkedKeys(v-model) | (Controlled) Specifies the keys of the checked treeNodes (PS: When this specifies the key of a treeNode which is also a parent treeNode, all the children treeNodes of will be checked; and vice versa, when it specifies the key of a treeNode which is a child treeNode, its parent treeNode will also be checked. When `checkable` and `checkStrictly` is true, its object has `checked` and `halfChecked` property. Regardless of whether the child or parent treeNode is checked, they won't impact each other. | string\[] \| number\[] \| {checked: string\[] \| number\[], halfChecked: string\[] \| number\[]} | \[] |  |
| checkStrictly | Check treeNode precisely; parent treeNode and children treeNodes are not associated | boolean | false |  |
| defaultExpandAll | Whether to expand all treeNodes by default | boolean | false |  |
| disabled | whether disabled the tree | bool | false |  |
| draggable | Specifies whether this Tree is draggable (IE > 8) | boolean | false |  |
| expandedKeys(v-model) | (Controlled) Specifies the keys of the expanded treeNodes | string\[] \| number\[] | \[] |  |
| filterTreeNode | Defines a function to filter (highlight) treeNodes. When the function returns `true`, the corresponding treeNode will be highlighted | function(node) | - |  |
| loadData | Load data asynchronously | function(node) | - |  |
| loadedKeys | (Controlled) Set loaded tree nodes. Need work with `loadData` | string\[] \| number\[] | \[] |  |
| multiple | Allows selecting multiple treeNodes | boolean | false |  |
| selectable | whether can be selected | boolean | true |  |
| selectedKeys(v-model) | (Controlled) Specifies the keys of the selected treeNodes | string\[] \| number\[] | - |  |
| showIcon | Shows the icon before a TreeNode's title. There is no default style; you must set a custom style for it if set to `true` | boolean | false |  |
| switcherIcon | customize collapse/expand icon of tree node | slot | - |  |
| showLine | Shows a connecting line | boolean | false |  |
| title | custom title | slot |  | 2.0.0 |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| check | Callback function for when the onCheck event occurs | function(checkedKeys, e:{checked: bool, checkedNodes, node, event}) |
| dragend | Callback function for when the onDragEnd event occurs | function({event, node}) |
| dragenter | Callback function for when the onDragEnter event occurs | function({event, node, expandedKeys}) |
| dragleave | Callback function for when the onDragLeave event occurs | function({event, node}) |
| dragover | Callback function for when the onDragOver event occurs | function({event, node}) |
| dragstart | Callback function for when the onDragStart event occurs | function({event, node}) |
| drop | Callback function for when the onDrop event occurs | function({event, node, dragNode, dragNodesKeys}) |
| expand | Callback function for when a treeNode is expanded or collapsed | function(expandedKeys, {expanded: bool, node}) |
| load | Callback function for when a treeNode is loaded | function(loadedKeys, {event, node}) |
| rightClick | Callback function for when the user right clicks a treeNode | function({event, node}) |
| select | Callback function for when the user clicks a treeNode | function(selectedKeys, e:{selected: bool, selectedNodes, node, event}) |

### TreeNode

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| class | className | string | - |  |
| style | style | string\|object | - |  |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - |  |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false |  |
| disabled | Disables the treeNode | boolean | false |  |
| icon | customize icon. When you pass component, whose render will receive full TreeNode props as component props | slot\|slot-scope | - |  |
| isLeaf | Determines if this is a leaf node(effective when `loadData` is specified) | boolean | false |  |
| key | Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys. P.S.: It must be unique in all of treeNodes of the tree! | string \| number | internal calculated position of treeNode |  |
| selectable | Set whether the treeNode can be selected | boolean | true |  |
| title | Title | string | '---' |  |

### DirectoryTree props

| Property     | Description                                                   | Type   | Default |
| ------------ | ------------------------------------------------------------- | ------ | ------- |
| expandAction | Directory open logic, optional `false` `'click'` `'dblclick'` | string | click   |

## FAQ

### How to hide file icon when use showLine?

File icon realize by using switcherIcon. You can overwrite the style to hide it
