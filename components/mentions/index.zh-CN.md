---
category: Components
type: 数据录入
title: Mentions
subtitle: 提及
cover: https://gw.alipayobjects.com/zos/alicdn/jPE-itMFM/Mentions.svg
---

提及组件。

## 何时使用

- 用于在输入中提及某人或某事，常用于发布、聊天或评论功能。

## API

### Mentions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autofocus | 自动获得焦点 | boolean | `false` |
| defaultValue | 默认值 | string |  |
| filterOption | 自定义过滤逻辑 | false \| (input: string, option: OptionProps) => boolean |  |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | 'Not Found' |
| placement | 弹出层展示位置 | `top` \| `bottom` | `bottom` |
| prefix | 设置触发关键字 | string \| string[] | '@' |
| split | 设置选中项前后分隔符 | string | ' ' |
| validateSearch | 自定义触发验证逻辑 | (text: string, props: MentionsProps) => void |  |
| value(v-model) | 设置值 | string |  |
| getPopupContainer | 指定建议框挂载的 HTML 节点 | () => HTMLElement |  |

### 事件

| 事件名称 | 说明               | 回调参数                                      |
| -------- | ------------------ | --------------------------------------------- |
| blur     | 失去焦点的时回调   | function                                      |
| change   | 值改变时触发       | function(value: string)                       |
| focus    | 获得焦点时回调     | function                                      |
| search   | 文本框值变化时回调 | function(value: string, prefix: string)       |
| select   | 选择选项时触发     | function(option: OptionProps, prefix: string) |

### Mentions 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### Option

| 参数  | 说明           | 类型   | 默认值 |
| ----- | -------------- | ------ | ------ |
| value | 选择时填充的值 | string | ''     |
