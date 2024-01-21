---
category: Components
subtitle: 排版
type: 通用
title: Typography
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

文本的基本格式。

## 何时使用

- 当需要展示标题、段落、列表内容时使用，如文章/博客/日志的文本样式。
- 当需要一列基于文本的基础操作时，如拷贝/省略/可编辑。

## API

### Typography.Text

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| code | 添加代码样式 | boolean | false |  |
| content(v-model) | 当使用 ellipsis 或 editable 时，使用 content 代替 children | string | - |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false | [copyable](#copyable) |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false | [editable](#editable) |
| ellipsis | 自动溢出省略 | boolean | false |  |
| keyboard | 添加键盘样式 | boolean | false |  |
| mark | 添加标记样式 | boolean | false |  |
| strong | 是否加粗 | boolean | false |  |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | 添加下划线样式 | boolean | false |  |

### Typography.Title

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| code | 添加代码样式 | boolean | false |  |
| content(v-model) | 当使用 ellipsis 或 editable 时，使用 content 代替 children | string | - |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false | [copyable](#copyable) |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false | [editable](#editable) |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false | [ellipsis](#ellipsis) |
| level | 重要程度，相当于 `h1`、`h2`、`h3`、`h4`、`h5` | number: 1, 2, 3, 4, 5 | 1 |  |
| mark | 添加标记样式 | boolean | false |  |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | 添加下划线样式 | boolean | false |  |

### Typography.Paragraph

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| code | 添加代码样式 | boolean | false |  |
| content(v-model) | 当使用 ellipsis 或 editable 时，使用 content 代替 children | string | - |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false | [copyable](#copyable) |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false | [editable](#editable) |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false | [ellipsis](#ellipsis) |
| mark | 添加标记样式 | boolean | false |  |
| strong | 是否加粗 | boolean | false |  |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | 添加下划线样式 | boolean | false |  |

### slots

| 名称 | 说明 | 参数 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| copyableIcon | 自定义拷贝图标 | `{ copied: boolean }` | `copied ? <CheckOutlined /> : <CopyOutlined />` |  |
| copyableTooltip | 自定义提示文案，当 `copyable.tooltip = false` 时关闭 | `{ copied: boolean }` | `copied ? '复制成功' : '复制'` |  |
| editableIcon | 自定义编辑图标 | - | &lt;EditOutlined /> |  |
| editableTooltip | 自定义提示文本，当 `editable.tooltip = false` 时关闭 | - | `编辑` |  |
| ellipsisSymbol | 自定义展开描述文案 | - | - |  |
| ellipsisTooltip | 省略时，展示提示信息 | - | - |  |
| enterEnterIcon | 在编辑段中自定义“enter”图标 | `{className: string}` | `<EnterOutlined />` | 3.0 |

### copyable

```json
  {
    text: string,
    onCopy: function(event),
    tooltip: false,
  }
```

| 参数    | 说明                 | 类型     | 默认值 | 版本 |
| ------- | -------------------- | -------- | ------ | ---- |
| text    | 拷贝到剪切板里的文本 | string   | -      |      |
| tooltip | 是否展示提示文本     | boolean  | true   |      |
| onCopy  | 拷贝成功的回调函数   | function | -      |      |

### editable

```json
  {
    tooltip: boolean,
    editing: boolean,
    maxlength: number,
    autoSize: boolean | { minRows: number, maxRows: number },
    onStart: function,
    onChange: function(string),
    onCancel: function,
    onEnd: function,
    triggerType: ('icon' | 'text')[],
  }
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoSize | 自动 resize 文本域 | boolean \| { minRows: number, maxRows: number } | - |  |
| editing | 控制是否是编辑中状态 | boolean | false |  |
| maxlength | 编辑中文本域最大长度 | number | - |  |
| tooltip | 是否展示提示文本 | boolean | true |  |
| triggerType | 编辑模式触发器类型，图标、文本或者两者都设置（不设置图标作为触发器时它会隐藏） | Array&lt;`icon`\|`text`> | \[`icon`] |  |
| onCancel | 按 ESC 退出编辑状态时触发 | function | - |  |
| onChange | 文本域编辑时触发 | function(event) | - |  |
| onEnd | 按 ENTER 结束编辑状态时触发 | function | - |  |
| onStart | 进入编辑中状态时触发 | function | - |  |

### ellipsis

```json
  {
    rows: number,
    expandable: boolean,
    suffix: string,
    symbol: string,
    tooltip: boolean,
    onExpand: function(event),
    onEllipsis: function(ellipsis),
  }
```

| 参数       | 说明                 | 类型               | 默认值 | 版本 |
| ---------- | -------------------- | ------------------ | ------ | ---- |
| expandable | 是否可展开           | boolean            | -      |      |
| rows       | 最多显示的行数       | number             | -      |      |
| suffix     | 自定义省略内容后缀   | string             | -      |      |
| symbol     | 自定义展开描述文案   | string             | `展开` |      |
| tooltip    | 省略时，展示提示信息 | boolean \| string  | -      |      |
| onEllipsis | 触发省略时的回调     | function(ellipsis) | -      |      |
| onExpand   | 点击展开时的回调     | function(event)    | -      |      |
