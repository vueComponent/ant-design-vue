---
category: Components
subtitle: 气泡确认框
type: Feedback
title: Popconfirm
---

点击元素，弹出气泡式的确认框。

## 何时使用

目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。

和 `confirm` 弹出的全屏居中模态对话框相比，交互形式更轻量。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| cancelText | 取消按钮文字 | string\|function\|slot | 取消 |
| okText | 确认按钮文字 | string\|function\|slot | 确定 |
| okType | 确认按钮类型 | string | primary |
| title | 确认框的描述 | string\|function\|slot | 无 |

### 事件
| 事件名称 | 说明 | 回调参数 |
| cancel | 点击取消时触发 | (e) |
| confirm | 点击确认时触发 | (e) |

更多属性请参考 [Tooltip](/components/tooltip/#API)。

## 注意

请确保 `Popconfirm` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
