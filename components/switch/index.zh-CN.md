---
category: Components
subtitle: 开关
type: 数据录入
title: Switch
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rtArRpBNDZcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*al07RK8SGf4AAAAAAAAAAAAADrJ8AQ/original
---

开关选择器。

## 何时使用

- 需要表示开关状态/两种状态之间的切换时；
- 和 `checkbox` 的区别是，切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autofocus | 组件自动获取焦点 | boolean | false |  |
| checked(v-model) | 指定当前是否选中 | checkedValue \| unCheckedValue | false |  |
| checkedChildren | 选中时的内容 | string\|slot |  |  |
| checkedValue | 选中时的值 | boolean \| string \| number | true | 2.2.1 |
| disabled | 是否禁用 | boolean | false |  |
| loading | 加载中的开关 | boolean | false |  |
| size | 开关大小，可选值：`default` `small` | string | default |  |
| unCheckedChildren | 非选中时的内容 | string\|slot |  |  |
| unCheckedValue | 非选中时的值 | boolean \| string \| number | false | 2.2.1 |

### 事件

| 事件名称 | 说明           | 回调参数                                                     |     |
| -------- | -------------- | ------------------------------------------------------------ | --- |
| change   | 变化时回调函数 | Function(checked: boolean \| string \| number, event: Event) |     |
| click    | 点击时回调函数 | Function(checked: boolean \| string \| number, event: Event) |     |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |
