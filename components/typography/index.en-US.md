---
category: Components
type: General
title: Typography
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

Basic text writing, including headings, body text, lists, and more.

## When To Use

- When need to display a title or paragraph contents in Articles/Blogs/Notes.
- When you need copyable/editable/ellipsis texts.

## API

### Typography.Text

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false |  |
| content(v-model) | When using ellipsis or editable, use content instead of children | string | - |  |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | [copyable](#copyable) |
| delete | Deleted line style | boolean | false |  |
| disabled | Disabled content | boolean | false |  |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false | [editable](#editable) |
| ellipsis | Display ellipsis when text overflows | boolean | false |  |
| keyboard | Keyboard style | boolean | false |  |
| mark | Marked style | boolean | false |  |
| strong | Bold style | boolean | false |  |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | Underlined style | boolean | false |  |

### Typography.Title

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false |  |
| content(v-model) | When using ellipsis or editable, use content instead of children | string | - |  |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | [copyable](#copyable) |
| delete | Deleted line style | boolean | false |  |
| disabled | Disabled content | boolean | false |  |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false | [editable](#editable) |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false | [ellipsis](#ellipsis) |
| level | Set content importance. Match with `h1`, `h2`, `h3`, `h4`, `h5` | number: 1, 2, 3, 4, 5 | 1 |  |
| mark | Marked style | boolean | false |  |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | Underlined style | boolean | false |  |

### Typography.Paragraph

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false |  |
| content(v-model) | When using ellipsis or editable, use content instead of children | string | - |  |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | [copyable](#copyable) |
| delete | Deleted line style | boolean | false |  |
| disabled | Disabled content | boolean | false |  |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false | [editable](#editable) |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false | [ellipsis](#ellipsis) |
| mark | Marked style | boolean | false |  |
| strong | Bold style | boolean | false |  |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | Underlined style | boolean | false |  |

### slots

| Name | Description | Property | Default | Version |
| --- | --- | --- | --- | --- |
| copyableIcon | Custom copy icon | `{ copied: boolean }` | `copied ? <CheckOutlined /> : <CopyOutlined />` |  |
| copyableTooltip | Custom tooltip text, hide when `copyable.tooltip = false` | `{ copied: boolean }` | `copied ? 'Copied' : 'Copy'` |  |
| editableEnterIcon | Custom "enter" icon in the edit field | `{className: string}` | `<EnterOutlined />` | 3.0 |
| editableIcon | Custom editable icon | - | &lt;EditOutlined /> |  |
| editableTooltip | Custom tooltip text, hide when `editable.tooltip = false` | - | `Edit` |  |
| ellipsisSymbol | Custom description of ellipsis | - | - |  |
| ellipsisTooltip | Show tooltip when ellipsis | - | - |  |

### copyable

```json
  {
    text: string,
    onCopy: function(event),
    tooltip: false,
  }
```

| Property | Description             | Type     | Default | Version |
| -------- | ----------------------- | -------- | ------- | ------- |
| text     | The text to copy        | string   | -       |         |
| tooltip  | Whether to show tooltip | boolean  | true    |         |
| onCopy   | Called when copied text | function | -       |         |

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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoSize | `autoSize` attribute of textarea | boolean \| { minRows: number, maxRows: number } | - |  |
| editing | Whether to be editable | boolean | false |  |
| maxlength | `maxlength` attribute of textarea | number | - |  |
| tooltip | Whether to show tooltip | boolean | true |  |
| triggerType | Edit mode trigger - icon, text or both (not specifying icon as trigger hides it) | Array&lt;`icon`\|`text`> | \[`icon`] |  |
| onCancel | Called when type ESC to exit editable state | function | - |  |
| onChange | Called when input at textarea | function(event) | - |  |
| onEnd | Called when type ENTER to exit editable state | function | - |  |
| onStart | Called when enter editable state | function | - |  |

### ellipsis

```json
  {
    rows: number,
    expandable: boolean,
    suffix: string,
    symbol: string,
    tooltip: boolean | string,
    onExpand: function(event),
    onEllipsis: function(ellipsis),
  }
```

| Property   | Description                               | Type               | Default  | Version |
| ---------- | ----------------------------------------- | ------------------ | -------- | ------- |
| expandable | Whether to be expandable                  | boolean            | -        |         |
| rows       | Max rows of content                       | number             | -        |         |
| suffix     | Suffix of ellipsis content                | string             | -        |         |
| symbol     | Custom description of ellipsis            | string             | `Expand` |         |
| tooltip    | Show tooltip when ellipsis                | boolean \| string  | -        |         |
| onEllipsis | Called when enter or leave ellipsis state | function(ellipsis) | -        |         |
| onExpand   | Called when expand content                | function(event)    | -        |         |
