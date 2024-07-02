---
category: Components
subtitle: 选择器
type: 数据录入
title: Select
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*zo76T7KQx2UAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5oPiTqPxGAUAAAAAAAAAAAAADrJ8AQ/original
---

下拉选择器。

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 [Radio](/components/radio/) 是更好的选择。

## API

```html
<a-select>
  <a-select-option value="lucy">lucy</a-select-option>
</a-select>
```

### Select props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean | false |  |
| autoClearSearchValue | 是否在选中项后清空搜索框，只在 `mode` 为 `multiple` 或 `tags` 时有效。 | boolean | true |  |
| autofocus | 默认获取焦点 | boolean | false |  |
| bordered | 是否有边框 | boolean | true |  |
| clearIcon | 自定义的多选框清空图标 | VNode \| slot | - |  |
| defaultActiveFirstOption | 是否默认高亮第一个选项。 | boolean | true |  |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - |  |
| disabled | 是否禁用 | boolean | false |  |
| popupClassName | 下拉菜单的 className 属性 | string | - | 4.0 |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true |  |
| dropdownMenuStyle | dropdown 菜单自定义样式 | object | - |  |
| dropdownRender | 自定义下拉框内容 | ({menuNode: VNode, props}) => VNode \| v-slot | - |  |
| dropdownStyle | 下拉菜单的 style 属性 | object | - |  |
| fieldNames | 自定义节点 label、value、options 的字段 | object | { label: `label`, value: `value`, options: `options` } | 3.0 |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 `true`，反之则返回 `false`。 | `boolean` \| `function(inputValue, option)` | true |  |
| filterSort | 搜索时对筛选结果项的排序函数, 类似[Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)里的 compareFunction | (optionA: Option, optionB: Option) => number | - | 3.0 |
| firstActiveValue | 默认高亮的选项 | string \| string\[] | - |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | function(triggerNode) | () => document.body |  |
| labelInValue | 是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 `string` 变为 `{key: string, label: vNodes, originLabel: any}` 的格式, originLabel（3.1） 保持原始类型，如果通过 a-select-option children 构造的节点，该值是是个函数（即 a-select-option 的默认插槽） | boolean | false |  |
| listHeight | 设置弹窗滚动高度 | number | 256 |  |
| maxTagCount | 最多显示多少个 tag | number | - |  |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | slot \| function(omittedValues) | - |  |
| maxTagTextLength | 最大显示的 tag 文本长度 | number | - |  |
| menuItemSelectedIcon | 自定义当前选中的条目图标 | VNode \| slot | - |  |
| mode | 设置 Select 的模式为多选或标签 | 'multiple' \| 'tags' \| 'combobox' | - |  |
| notFoundContent | 当下拉列表为空时显示的内容 | string\|slot | `Not Found` |  |
| open | 是否展开下拉菜单 | boolean | - |  |
| option | 通过 option 插槽，自定义节点 | v-slot:option="{value, label, [disabled, key, title]}" | - | 2.2.5 |
| optionFilterProp | 搜索时过滤对应的 option 属性，不支持 children | string | value |  |
| optionLabelProp | 回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 `value`。 | string | `children` \| `label`(设置 options 时) |  |
| options | options 数据，如果设置则不需要手动构造 selectOption 节点 | Array&lt;{value, label, [disabled, key, title]}> | \[] |  |
| placeholder | 选择框默认文字 | string\|slot | - |  |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | 3.3.0 |
| removeIcon | 自定义的多选框清除图标 | VNode \| slot | - |  |
| searchValue | 控制搜索文本 | string | - |  |
| showArrow | 是否显示下拉小箭头 | boolean | 单选为 true,多选为 false |  |
| showSearch | 配置是否可搜索 | boolean | 单选为 false,多选为 true |  |
| size | 选择框大小，可选 `large` `small` | string | default |  |
| status | 设置校验状态 | 'error' \| 'warning' | - | 3.3.0 |
| suffixIcon | 自定义的选择框后缀图标 | VNode \| slot | - |  |
| tagRender | 自定义 tag 内容 render，仅在 `mode` 为 `multiple` 或 `tags` 时生效 | slot \| (props) => any | - | 3.0 |
| tokenSeparators | 自动分词的分隔符，仅在 `mode="tags"` 时生效 | string\[] | - |  |
| value(v-model) | 指定当前选中的条目 | string\|string\[]\|number\|number\[] | - |  |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | 3.0 |

> 注意，如果发现下拉菜单跟随页面滚动，或者需要在其他弹层中触发 Select，请尝试使用 `getPopupContainer={triggerNode => triggerNode.parentNode}` 将下拉弹层渲染节点固定在触发器的父元素中。

### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| blur | 失去焦点的时回调 | function |
| change | 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数 | function(value, option:Option \| Array&lt;Option>) |
| deselect | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 multiple 或 tags 模式下生效 | function(value，option:Option) |
| dropdownVisibleChange | 展开下拉菜单的回调 | function(open) |
| focus | 获得焦点时回调 | function |
| inputKeyDown | 键盘按下时回调 | function |
| mouseenter | 鼠标移入时回调 | function |
| mouseleave | 鼠标移出时回调 | function |
| popupScroll | 下拉列表滚动时的回调 | function |
| search | 文本框值变化时回调 | function(value: string) |
| select | 被选中时调用，参数为选中项的 value (或 key) 值 | function(value, option:Option) |

### Select Methods

| 名称    | 说明     |
| ------- | -------- |
| blur()  | 取消焦点 |
| focus() | 获取焦点 |

### Option props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| class | Option 器类名 | string | - |
| disabled | 是否禁用 | boolean | false |
| key | 和 value 含义一致。如果 Vue 需要你设置此项，此项值与 value 的值相同，然后可以省略 value 设置 | string |  |
| title | 选中该 Option 后，Select 的 title | string | - |
| value | 默认根据此属性值进行筛选 | string\|number | - |

### OptGroup props

| 参数  | 说明 | 类型                      | 默认值 |
| ----- | ---- | ------------------------- | ------ |
| key   |      | string                    | -      |
| label | 组名 | string\|function(h)\|slot | -      |

## FAQ

### 点击 `dropdownRender` 里的内容浮层关闭怎么办？

自定义内容点击时会关闭浮层，如果不喜欢关闭，可以通过取消点击事件的默认行为进行阻止。 看下 [dropdownRender 例子](#components-select-demo-custom-dropdown-menu) 里的说明。

### 为什么 `placeholder` 不显示 ？

`placeholder` 只有在 value = undefined 才会显示，对于其它的 null、0、'' 等等对于 JS 语言都是有意义的值。

你可以查看 [JS 语言规范](https://262.ecma-international.org/5.1/#sec-4.3.9) 进一步了解详情。

也可以查看 [antd issue](https://github.com/ant-design/ant-design/issues/2367) 查看讨论情况。
