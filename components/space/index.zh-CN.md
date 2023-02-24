---
category: Components
type: 布局
subtitle: 间距
title: Space
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZiJ3SbOH9SUAAAAAAAAAAAAADrJ8AQ/original
---

设置组件之间的间距。

## 何时使用

避免组件紧贴在一起，拉开统一的空间。

- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。
- 需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact（自 `ant-design-vue@4.0.0` 版本开始提供该组件）。

## API

### Space

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `end` \|`center` \|`baseline` | - | 1.6.5 |
| direction | 间距方向 | `vertical` \| `horizontal` | `horizontal` | 1.6.5 |
| size | 间距大小 | `small` \| `middle` \| `large` \| `number` | `small` | 1.6.5 |
| split | 设置拆分 | VueNode \| v-slot | - | 2.2.0 |
| wrap | 是否自动换行，仅在 `horizontal` 时有效 | boolean | false | 2.2.0 |

### Space.Compact

> 自 ant-design-vue@4.0.0 版本开始提供该组件。

需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact。支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- Select
- TimePicker
- TreeSelect

| 参数      | 说明                         | 类型                           | 默认值       | 版本  |
| --------- | ---------------------------- | ------------------------------ | ------------ | ----- |
| block     | 将宽度调整为父元素宽度的选项 | boolean                        | false        | 4.0.0 |
| direction | 指定排列方向                 | `vertical` \| `horizontal`     | `horizontal` | 4.0.0 |
| size      | 子组件大小                   | `large` \| `middle` \| `small` | `middle`     | 4.0.0 |
