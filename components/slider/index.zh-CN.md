---
category: Components
subtitle: 滑动输入条
type: 数据录入
title: Slider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_4heQaUrFn4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XkgXTaudeosAAAAAAAAAAAAADrJ8AQ/original
---

滑动型输入器，展示当前值和可选范围。

## 何时使用

当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autofocus | 自动获取焦点 | boolean | false |  |
| disabled | 值为 `true` 时，滑块为禁用状态 | boolean | false |  |
| dots | 是否只能拖拽到刻度上 | boolean | false |  |
| included | `marks` 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列 | boolean | true |  |
| mark | 自定义刻度标记 | v-slot:mark | { point: number, label: any } | 3.0 |
| marks | 刻度标记，key 的类型必须为 `number` 且取值在闭区间 \[min, max] 内，每个标签可以单独设置样式 | object | { number: string\|VNode } or { number: { style: object, label: string\|VNode } } or { number: () => VNode } |  |
| max | 最大值 | number | 100 |  |
| min | 最小值 | number | 0 |  |
| range | 双滑块模式 | boolean | false |  |
| reverse | 反向坐标轴 | boolean | false | 1.5.0 |
| step | 步长，取值必须大于 0，并且可被 (max - min) 整除。当 `marks` 不为空对象时，可以设置 `step` 为 `null`，此时 Slider 的可选值仅有 marks 标出来的部分。 | number\|null | 1 |  |
| value(v-model) | 设置当前取值。当 `range` 为 `false` 时，使用 `number`，否则用 `[number, number]` | number\|number\[] |  |  |
| vertical | 值为 `true` 时，Slider 为垂直方向 | Boolean | false |  |
| tipFormatter | Slider 会把当前值传给 `tipFormatter`，并在 Tooltip 中显示 `tipFormatter` 的返回值，若为 null，则隐藏 Tooltip。 | Function\|null | IDENTITY |  |
| tooltipPlacement | 设置 Tooltip 展示位置。参考 [`Tooltip`](/components/tooltip/)。 | string |  | 1.5.0 |
| tooltipOpen | 值为`true`时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时。 | Boolean |  | 4.0 |
| getTooltipPopupContainer | Tooltip 渲染父节点，默认渲染到 body 上。 | Function | () => document.body | 1.5.0 |

### 事件

| 事件名称 | 说明 | 回调参数 |  |
| --- | --- | --- | --- |
| change | 当 Slider 的值发生改变时，会触发 change 事件，并把改变后的值作为参数传入。 | Function(value) | NOOP |
| afterChange | 与 `mouseup` 触发时机一致，把当前值作为参数传入。 | Function(value) | NOOP |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |
