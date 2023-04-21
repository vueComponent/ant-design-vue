---
category: Components
type: 数据展示
title: Popover
subtitle: 气泡卡片
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XhL3QpRw92kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*RMP_TrdZ3nsAAAAAAAAAAAAADrJ8AQ/original
---

点击/鼠标移入元素，弹出气泡式的卡片浮层。

## 何时使用

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。

和 `Tooltip` 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

## API

| 参数    | 说明     | 类型                | 默认值 | 版本 |
| ------- | -------- | ------------------- | ------ | ---- |
| content | 卡片内容 | string\|slot\|VNode | -      |      |
| title   | 卡片标题 | string\|slot\|VNode | -      |      |

更多属性请参考 [Tooltip](/components/tooltip-cn/#api)。

## 注意

请确保 `Popover` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
