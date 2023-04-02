---
category: Components
type: 反馈
title: Alert
subtitle: 警告提示
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Ct7bT7rrTTAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-U3XQqYN7VsAAAAAAAAAAAAADrJ8AQ/original
---

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| action | 自定义操作项 | slot | - | 4.0.0 |
| afterClose | 关闭动画结束后触发的回调函数 | () => void | - |  |
| banner | 是否用作顶部公告 | boolean | false |  |
| closable | 默认不显示关闭按钮 | boolean | 无 |  |
| closeIcon | 自定义关闭 Icon | slot | `<CloseOutlined />` | 3.0 |
| closeText | 自定义关闭按钮 | string\|slot | 无 |  |
| description | 警告提示的辅助性文字介绍 | string\|slot | 无 |  |
| icon | 自定义图标，`showIcon` 为 `true` 时有效 | vnode\|slot | - |  |
| message | 警告提示内容 | string\|slot | 无 |  |
| showIcon | 是否显示辅助图标 | boolean | false,`banner` 模式下默认值为 true |  |
| type | 指定警告提示的样式，有四种选择 `success`、`info`、`warning`、`error` | string | `info`,`banner` 模式下默认值为 `warning` |  |

### 事件

| 事件名称 | 说明                 | 回调参数                | 版本 |
| -------- | -------------------- | ----------------------- | ---- |
| close    | 关闭时触发的回调函数 | (e: MouseEvent) => void | -    |
