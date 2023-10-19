---
category: Components
subtitle: 多选框
type: 数据录入
title: Checkbox
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*DzgiRbW3khIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G3MjTYXL6AIAAAAAAAAAAAAADrJ8AQ/original
---

多选框。

## 何时使用

- 在一组可选项中进行多项选择时；
- 单独使用可以表示两种状态之间的切换，和 `switch` 类似。区别在于切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## API

### 属性

#### Checkbox

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autofocus | 自动获取焦点 | boolean | false |  |
| checked(v-model) | 指定当前是否选中 | boolean | false |  |
| disabled | 失效状态 | boolean | false |  |
| indeterminate | 设置 indeterminate 状态，只负责样式控制 | boolean | false |  |
| value | 与 CheckboxGroup 组合使用时的值 | boolean \| string \| number | - |  |

#### 事件

| 事件名称 | 说明           | 回调参数          | 版本 |     |
| -------- | -------------- | ----------------- | ---- | --- |
| change   | 变化时回调函数 | Function(e:Event) | -    |     |

#### Checkbox Group

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| disabled | 整组失效 | boolean | false |  |
| name | CheckboxGroup 下所有 `input[type="checkbox"]` 的 `name` 属性 | string | - | 1.5.0 |
| options | 指定可选项，可以通过 slot="label" slot-scope="option" 定制`label` | string\[] \| Array&lt;{ label: string value: string disabled?: boolean, indeterminate?: boolean, onChange?: function }> | \[] |  |
| value(v-model) | 指定选中的选项 | (boolean \| string \| number)\[] | \[] |  |

#### 事件

| 事件名称 | 说明           | 回调参数               | 版本 |     |
| -------- | -------------- | ---------------------- | ---- | --- |
| change   | 变化时回调函数 | Function(checkedValue) | -    |     |

### 方法

#### Checkbox

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |
