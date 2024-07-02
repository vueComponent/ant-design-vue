---
category: Components
type: 数据录入
title: TreeSelect
subtitle: 树选择
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*DfTMRYSDngEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Y5pcQLplFu4AAAAAAAAAAAAADrJ8AQ/original
---

树型选择控件。

## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。

## API

### Tree props

| 参数 | 说明 | 类型 | 默认值 | 版本 |  |
| --- | --- | --- | --- | --- | --- |
| allowClear | 显示清除按钮 | boolean | false |  |  |
| defaultValue | 指定默认选中的条目 | string/string\[] | - |  |  |
| disabled | 是否禁用 | boolean | false |  |  |
| popupClassName | 下拉菜单的 className 属性 | string | - |  | 4.0 |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true |  |  |
| dropdownStyle | 下拉菜单的样式 | object | - |  |  |
| fieldNames | 替换 treeNode 中 label,value,children 字段为 treeData 中对应的字段 | object | {children:'children', label:'title', value: 'value' } |  | 3.0.0 |
| filterTreeNode | 是否根据输入项进行筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值 | boolean\|Function(inputValue: string, treeNode: TreeNode) (函数需要返回 bool 值) | Function |  |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | Function(triggerNode) | () => document.body |  |  |
| labelInValue | 是否把每个选项的 label 包装到 value 中，会把 value 类型从 `string` 变为 `{value: string, label: VNode, halfChecked(treeCheckStrictly 时有效): string[] }` 的格式 | boolean | false |  |  |
| listHeight | 设置弹窗滚动高度 | number | 256 |  |  |
| loadData | 异步加载数据 | function(node) | - |  |  |
| maxTagCount | 最多显示多少个 tag | number | - |  |  |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | slot/function(omittedValues) | - |  |  |
| multiple | 支持多选（当设置 treeCheckable 时自动变为 true） | boolean | false |  |  |
| notFoundContent | 当下拉列表为空时显示的内容 | slot | `Not Found` |  |  |
| placeholder | 选择框默认文字 | string\|slot | - |  |  |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | 3.3.0 |
| replaceFields | 替换 treeNode 中 label,value,key,children 字段为 treeData 中对应的字段 | object | {children:'children', label:'title', key:'key', value: 'value' } |  | 1.6.1 (3.0.0 废弃) |
| searchPlaceholder | 搜索框默认文字 | string\|slot | - |  |  |
| searchValue(v-model) | 搜索框的值，可以通过 `search` 事件获取用户输入 | string | - |  |  |
| showCheckedStrategy | 定义选中项回填的方式。`TreeSelect.SHOW_ALL`: 显示所有选中节点(包括父节点). `TreeSelect.SHOW_PARENT`: 只显示父节点(当父节点下所有子节点都选中时). 默认只显示子节点. | enum{TreeSelect.SHOW_ALL, TreeSelect.SHOW_PARENT, TreeSelect.SHOW_CHILD } | TreeSelect.SHOW_CHILD |  |  |
| showSearch | 在下拉中显示搜索框(仅在单选模式下生效) | boolean | false |  |  |
| size | 选择框大小，可选 `large` `small` | string | 'default' |  |  |
| status | 设置校验状态 | 'error' \| 'warning' | - | 3.3.0 |
| suffixIcon | 自定义的选择框后缀图标 | VNode \| slot | - |  |  |
| tagRender | 自定义 tag 内容，多选时生效 | slot | - | 3.0 |  |
| title | 自定义标题 | slot |  | 3.0.0 |  |
| treeCheckable | 显示 checkbox | boolean | false |  |  |
| treeCheckStrictly | checkable 状态下节点选择完全受控（父子节点选中状态不再关联），会使得 `labelInValue` 强制为 true | boolean | false |  |  |
| treeData | treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一） | array&lt;{value, label, children, [disabled, disableCheckbox, selectable]}> | \[] |  |  |
| treeDataSimpleMode | 使用简单格式的 treeData，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: \[{id:1, pId:0, value:'1', label:"test1",...},...], `pId` 是父节点的 id) | false\|Array&lt;{ id: string, pId: string, rootPId: null }> | false |  |  |
| treeDefaultExpandAll | 默认展开所有树节点 | boolean | false |  |  |
| treeDefaultExpandedKeys | 默认展开的树节点 | string\[] \| number\[] | - |  |  |
| treeExpandedKeys(v-model) | 设置展开的树节点 | string\[] \| number\[] | - |  |  |
| treeIcon | 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式 | boolean | false |  |  |
| treeLine | 是否展示线条样式，请参考 [Tree - showLine](/components/tree/#components-tree-demo-line) | boolean \| object | false | 3.0 |  |
| treeLoadedKeys | （受控）已经加载的节点，需要配合 `loadData` 使用 | string[] | [] | 3.3.0 |
| treeNodeFilterProp | 输入项过滤对应的 treeNode 属性 | string | 'value' |  |  |
| treeNodeLabelProp | 作为显示的 prop 设置 | string | 'title' |  |  |
| value(v-model) | 指定当前选中的条目 | string/string\[] | - |  |  |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | 3.0 |  |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 选中树节点或输入值发生变化时调用此函数 | function(value, label, extra) |  |
| dropdownVisibleChange | 展开下拉菜单的回调 | function(open) | 3.0 |
| search | 文本框值变化时回调 | function(value: string) |  |
| select | 树节点被选中时调用 | function(value, node, extra) |  |
| treeExpand | 展开树节点时调用 | function(expandedKeys) |  |

### Tree 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### TreeNode props

> 建议使用 treeData 来代替 TreeNode，免去手工构造麻烦

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checkable | 当树为 checkable 时，设置独立节点是否展示 Checkbox | boolean | - |  |
| disableCheckbox | 禁掉 checkbox | boolean | false |  |
| disabled | 是否禁用 | boolean | false |  |
| isLeaf | 是否是叶子节点 | boolean | false |  |
| key | 此项必须设置（其值在整个树范围内唯一） | string \| number | - |  |
| selectable | 是否可选 | boolean | true |  |
| title | 树节点显示的内容 | string\|slot | '---' |  |
| value | 默认根据此属性值进行筛选（其值在整个树范围内唯一） | string | - |  |
