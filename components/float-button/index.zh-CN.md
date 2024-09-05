---
category: Components
subtitle: 悬浮按钮
type: 其他
title: FloatButton
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HS-wTIIwu0kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a0hwTY_rOSUAAAAAAAAAAAAADrJ8AQ/original
tag: New
---

悬浮按钮。自 `4.0.0` 版本开始提供该组件。

## 何时使用

- 用于网站上的全局功能；
- 无论浏览到何处都可以看见的按钮。

## API

> 自 `ant-design-vue@4.0.0` 版本开始提供该组件。

### 共同的 API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| icon | 自定义图标 | slot | - |  |
| description | 文字及其它内容 | string \| slot | - |  |
| tooltip | 气泡卡片的内容 | string \| slot | - |  |
| type | 设置按钮类型 | `default` \| `primary` | `default` |  |
| shape | 设置按钮形状 | `circle` \| `square` | `circle` |  |
| onClick | 点击按钮时的回调 | (event) => void | - |  |
| href | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 | string | - |  |
| target | 相当于 a 标签的 target 属性，href 存在时生效 | string | - |  |
| badge | 带徽标数字的悬浮按钮（不支持 status 以及相关属性） | [BadgeProps](/components/badge-cn#api) | - |  |

### 共同的事件

| 事件名称 | 说明                          | 回调参数          | 版本 |
| -------- | ----------------------------- | ----------------- | ---- |
| click    | 设置处理 `click` 事件的处理器 | `(event) => void` | -    |

### FloatButton.Group

| 参数          | 说明                             | 类型                 | 默认值   | 版本 |
| ------------- | -------------------------------- | -------------------- | -------- | ---- |
| shape         | 设置包含的 FloatButton 按钮形状  | `circle` \| `square` | `circle` |      |
| trigger       | 触发方式（有触发方式为菜单模式） | `click` \| `hover`   | -        |      |
| open(v-model) | 受控展开                         | boolean              | -        |      |

### FloatButton.Group 事件

| 事件名称   | 说明             | 回调参数                | 版本 |
| ---------- | ---------------- | ----------------------- | ---- |
| openChange | 展开收起时的回调 | (open: boolean) => void | -    |

### FloatButton.BackTop

| 参数             | 说明                               | 类型              | 默认值       | 版本 |
| ---------------- | ---------------------------------- | ----------------- | ------------ | ---- |
| duration         | 回到顶部所需时间（ms）             | number            | 450          |      |
| target           | 设置需要监听其滚动事件的元素       | () => HTMLElement | () => window |      |
| visibilityHeight | 滚动高度达到此参数值才出现 BackTop | number            | 400          |      |
| onClick          | 点击按钮的回调函数                 | () => void        | -            |      |
