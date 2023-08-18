---
category: Components
type: 数据录入
title: Input
subtitle: 输入框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Y3R0RowXHlAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sBqqTatJ-AkAAAAAAAAAAAAADrJ8AQ/original
---

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## API

### Input

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| addonAfter | 带标签的 input，设置后置标签 | string\|slot |  |  |
| addonBefore | 带标签的 input，设置前置标签 | string\|slot |  |  |
| allowClear | 可以点击清除图标删除内容 | boolean |  |  |
| bordered | 是否有边框 | boolean | true | 3.0 |
| clearIcon | 自定义清除图标 （allowClear 为 true 时生效） | slot | `<CloseCircleFilled />` | 3.3.0 |
| defaultValue | 输入框默认内容 | string |  |  |
| disabled | 是否禁用状态，默认为 false | boolean | false |  |
| id | 输入框的 id | string |  |  |
| maxlength | 最大长度 | number |  | 1.5.0 |
| prefix | 带有前缀图标的 input | string\|slot |  |  |
| showCount | 是否展示字数 | boolean | false | 3.0 |
| status | 设置校验状态 | 'error' \| 'warning' | - | 3.3.0 |
| size | 控件大小。注：标准表单内的输入框大小限制为 `middle`。可选 `large` `middle` `small` | string | - |  |
| suffix | 带有后缀图标的 input | string\|slot |  |  |
| type | 声明 input 类型，同原生 input 标签的 type 属性，见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#属性)(请直接使用 `<a-textarea />` 代替 `type="textarea"`)。 | string | `text` |  |
| value(v-model) | 输入框内容 | string |  |  |

### Input 事件

| 事件名称   | 说明                   | 回调参数    |     |
| ---------- | ---------------------- | ----------- | --- |
| change     | 输入框内容变化时的回调 | function(e) |     |
| pressEnter | 按下回车的回调         | function(e) |     |

> 如果 `Input` 在 `Form.Item` 内，并且 `Form.Item` 设置了 `id` 和 `options` 属性，则 `value` `defaultValue` 和 `id` 属性会被自动设置。

### TextArea

| 参数 | 说明 | 类型 | 默认值 | 版本 |  |
| --- | --- | --- | --- | --- | --- |
| allowClear | 可以点击清除图标删除内容 | boolean |  | 1.5.0 |  |
| autosize | 自适应内容高度，可设置为 `true | false` 或对象：`{ minRows: 2, maxRows: 6 }` | boolean\|object | false |  |
| defaultValue | 输入框默认内容 | string |  |  |  |
| showCount | 是否展示字数 | boolean | false |  |  |
| value(v-model) | 输入框内容 | string |  |  |  |

### TextArea 事件

| 事件名称   | 说明           | 回调参数    |
| ---------- | -------------- | ----------- |
| pressEnter | 按下回车的回调 | function(e) |

`Textarea` 的其他属性和浏览器自带的 [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) 一致。

#### Input.Search

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| enterButton | 是否有确认按钮，可设为按钮文字。该属性会与 addon 冲突。 | boolean\|slot | false |  |
| loading | 搜索 loading | boolean |  | 1.5.0 |

### Input.Search 事件

| 事件名称 | 说明                         | 回调参数               |
| -------- | ---------------------------- | ---------------------- |
| search   | 点击搜索或按下回车键时的回调 | function(value, event) |

其余属性和 Input 一致。

#### Input.Group

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| compact | 是否用紧凑模式 | boolean | false |
| size | `Input.Group` 中所有的 `Input` 的大小，可选 `large` `default` `small` | string | `default` |

```html
<a-input-group>
  <a-input />
  <a-input />
</a-input-group>
```

#### Input.Password (1.14.0 中新增)

| 参数             | 说明                             | 类型    | 默认值 |
| ---------------- | -------------------------------- | ------- | ------ |
| visible(v-model) | 密码是否可见                     | boolean | false  |
| iconRender       | 自定义切换按钮                   | slot    | -      |
| visibilityToggle | 是否显示切换按钮或者控制密码显隐 | boolean | true   |
