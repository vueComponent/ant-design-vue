---
category: Components
type: 数据录入
title: Radio
subtitle: 单选框
cover: https://gw.alipayobjects.com/zos/alicdn/8cYb5seNB/Radio.svg
---

单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## API

### Radio/Radio.Button

| 参数             | 说明                              | 类型    | 默认值 |
| ---------------- | --------------------------------- | ------- | ------ |
| autofocus        | 自动获取焦点                      | boolean | false  |
| checked(v-model) | 指定当前是否选中                  | boolean | false  |
| disabled         | 禁用 Radio                        | boolean | false  |
| value            | 根据 value 进行比较，判断是否选中 | any     | -      |

### RadioGroup

单选框组合，用于包裹一组 `Radio`。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| buttonStyle | RadioButton 的风格样式，目前有描边和填色两种风格 | `outline` \| `solid` | `outline` |  |
| disabled | 禁选所有子单选器 | boolean | false |  |
| name | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性 | string | - |  |
| options | 以配置形式设置子元素 | string\[] \| Array&lt;{ label: string value: string disabled?: boolean }> | - |  |
| optionType | 用于设置 Radio `options` 类型 | `default` \| `button` | `default` | 3.0.0 |
| size | 大小，只对按钮样式生效 | `large` \| `default` \| `small` | `default` |  |
| value(v-model) | 用于设置当前选中的值 | any | - |  |

### RadioGroup 事件

| 事件名称 | 说明                 | 回调参数          |
| -------- | -------------------- | ----------------- |
| change   | 选项变化时的回调函数 | Function(e:Event) |

## 方法

### Radio

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |
