---
category: Components
type: Data Display
title: Tree
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Ag9_Q6ArswEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1GeUQJPTGUYAAAAAAAAAAAAADrJ8AQ/original
---

A hierarchical list structure component.

## When To Use

Almost anything can be represented in a tree structure. Examples include directories, organization hierarchies, biological classifications, countries, etc. The `Tree` component is a way of representing the hierarchical relationship between these things. You can also expand, collapse, and select a treeNode within a `Tree`.

## API

### Tree props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowDrop | Whether to allow dropping on the node | ({ dropNode, dropPosition }) => boolean | - |  |
| autoExpandParent | Whether to automatically expand a parent treeNode | boolean | false |  |
| blockNode | Whether treeNode fill remaining horizontal space | boolean | false |  |
| checkable | Adds a `Checkbox` before the treeNodes | boolean | false |  |
| checkedKeys(v-model) | (Controlled) Specifies the keys of the checked treeNodes (PS: When this specifies the key of a treeNode which is also a parent treeNode, all the children treeNodes of will be checked; and vice versa, when it specifies the key of a treeNode which is a child treeNode, its parent treeNode will also be checked. When `checkable` and `checkStrictly` is true, its object has `checked` and `halfChecked` property. Regardless of whether the child or parent treeNode is checked, they won't impact each other. | string\[] \| number\[] \| {checked: string\[] \| number\[], halfChecked: string\[] \| number\[]} | \[] |  |
| checkStrictly | Check treeNode precisely; parent treeNode and children treeNodes are not associated | boolean | false |  |
| defaultExpandAll | Whether to expand all treeNodes by default | boolean | false |  |
| disabled | whether disabled the tree | bool | false |  |
| draggable | Specifies whether this Tree is draggable (IE > 8) | boolean | false |  |
| expandedKeys(v-model) | (Controlled) Specifies the keys of the expanded treeNodes | string\[] \| number\[] | \[] |  |
| fieldNames | Replace the title,key and children fields in treeNode with the corresponding fields in treeData | object | { children:'children', title:'title', key:'key' } | 3.0.0 |
| filterTreeNode | Defines a function to filter (highlight) treeNodes. When the function returns `true`, the corresponding treeNode will be highlighted | function(node) | - |  |
| height | Config virtual scroll height. Will not support horizontal scroll when enable this | number | - |  |
| loadData | Load data asynchronously | function(node) | - |  |
| loadedKeys | (Controlled) Set loaded tree nodes. Need work with `loadData` | string\[] \| number\[] | \[] |  |
| multiple | Allows selecting multiple treeNodes | boolean | false |  |
| selectable | whether can be selected | boolean | true |  |
| selectedKeys(v-model) | (Controlled) Specifies the keys of the selected treeNodes | string\[] \| number\[] | - |  |
| showIcon | Shows the icon before a TreeNode's title. There is no default style; you must set a custom style for it if set to `true` | boolean | false |  |
| showLine | Shows a connecting line | boolean \| {showLeafIcon: boolean}(3.0+) | false |  |
| switcherIcon | customize collapse/expand icon of tree node | v-slot:switcherIcon="{active, checked, expanded, loading, selected, halfChecked, title, key, children, dataRef, data, defaultIcon, switcherCls}" | - |  |
| title | custom title | slot |  | 2.0.0 |
| treeData | treeNode of tree, please use `treeNodes` before v1.1.4 | [TreeNode\[\]](#treenode) | - |  |
| virtual | Disable virtual scroll when set to false | boolean | true | 3.0 |

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

### Tree Methods

| Name | Description |
| --- | --- |
| scrollTo({ key: string \| number; align?: 'top' \| 'bottom' \| 'auto'; offset?: number }) | Scroll to key item in virtual scroll |

### TreeNode

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - |  |
| class | className | string | - |  |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false |  |
| disabled | Disables the treeNode | boolean | false |  |
| icon | customize icon. When you pass component, whose render will receive full TreeNode props as component props | slot\|slot-scope | - |  |
| isLeaf | Determines if this is a leaf node(effective when `loadData` is specified) | boolean | - |  |
| key | Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys. P.S.: It must be unique in all of treeNodes of the tree! | string \| number | internal calculated position of treeNode |  |
| selectable | Set whether the treeNode can be selected | boolean | true |  |
| style | style | string\|object | - |  |
| title | Title | string | '---' |  |

### DirectoryTree props

| Property     | Description                                                   | Type   | Default |
| ------------ | ------------------------------------------------------------- | ------ | ------- |
| expandAction | Directory open logic, optional `false` `'click'` `'dblclick'` | string | click   |

## FAQ

### How to hide file icon when use showLine?

File icon realize by using switcherIcon. You can overwrite the style to hide it
