---
category: Components
type: 数据录入
title: Rate
subtitle: 评分
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*oyOcTrB12_YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M7_ER7GJr6wAAAAAAAAAAAAADrJ8AQ/original
---

评分组件。

## 何时使用

- 对评价进行展示。
- 对事物进行快速的评级操作。

## API

| 属性           | 说明                   | 类型           | 默认值             |
| -------------- | ---------------------- | -------------- | ------------------ |
| allowClear     | 是否允许再次点击后清除 | boolean        | true               |
| allowHalf      | 是否允许半选           | boolean        | false              |
| autofocus      | 自动获取焦点           | boolean        | false              |
| character      | 自定义字符             | string \| slot | `<StarOutlined />` |
| count          | star 总数              | number         | 5                  |
| disabled       | 只读，无法进行交互     | boolean        | false              |
| tooltips       | 自定义每项的提示信息   | string[]       | -                  |
| value(v-model) | 当前数，受控值         | number         | -                  |

### 事件

| 事件名称    | 说明                     | 回调参数                |     |
| ----------- | ------------------------ | ----------------------- | --- |
| blur        | 失去焦点时的回调         | Function()              | -   |
| change      | 选择时的回调             | Function(value: number) | -   |
| focus       | 获取焦点时的回调         | Function()              | -   |
| hoverChange | 鼠标经过时数值变化的回调 | Function(value: number) | -   |
| keydown     | 按键回调                 | Function(event)         | -   |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |
