---
category: Components
subtitle: 步骤条
type: 导航
cols: 1
title: Steps
cover: https://gw.alipayobjects.com/zos/antfincdn/UZYqMizXHaj/Steps.svg
---

引导用户按照流程完成任务的导航条。

## 何时使用

当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。

## API

```jsx
<a-steps>
  <a-step title="第一步" />
  <a-step title="第二步" />
  <a-step title="第三步" />
</a-steps>
```

### Steps

整体步骤条。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 步骤条类型，有 `default` 和 `navigation` 两种 | string | `default` | 1.5.0 |
| current (v-model) | 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态, 1.5.0 后支持 v-model | number | 0 |  |
| direction | 指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向 | string | horizontal |  |
| labelPlacement | 指定标签放置位置，默认水平放图标右侧，可选`vertical`放图标下方 | string | `horizontal` |  |
| progressDot | 点状步骤条，可以设置为一个 作用域插槽,labelPlacement 将强制为`vertical` | Boolean or v-slot:progressDot="{index, status, title, description, prefixCls, iconDot}" | false |  |
| percent | 当前 `process` 步骤显示的进度条进度（只对基本类型的 Steps 生效） | number | - | 3.0 |
| responsive | 当屏幕宽度小于 532px 时自动变为垂直模式 | boolean | true | 3.0 |
| size | 指定大小，目前支持普通（`default`）和迷你（`small`） | string | default |  |
| status | 指定当前步骤的状态，可选 `wait` `process` `finish` `error` | string | process |  |
| initial | 起始序号，从 0 开始记数 | number | 0 |  |

#### Steps 事件

| 事件名称 | 说明               | 回调参数          | 版本 |
| -------- | ------------------ | ----------------- | ---- |
| change   | 点击切换步骤时触发 | (current) => void | -    | 1.5.0 |

### Steps.Step

步骤条内的每一个步骤。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| description | 步骤的详情描述，可选 | string \| slot | - |  |
| icon | 步骤图标的类型，可选 | string \| slot | - |  |
| status | 指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait` `process` `finish` `error` | string | wait |  |
| title | 标题 | string \| slot | - |  |
| subTitle | 子标题 | string \| slot | - | 1.5.0 |
| disabled | 禁用点击 | boolean | false | 1.5.0 |
