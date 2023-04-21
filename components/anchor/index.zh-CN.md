---
category: Components
subtitle: 锚点
cols: 1
type: 导航
title: Anchor
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*TBTSR4PyVmkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JGb3RIzyOCkAAAAAAAAAAAAADrJ8AQ/original
---

用于跳转到页面指定位置。

## 何时使用

需要展现当前页面上可供跳转的锚点链接，以及快速在锚点之间跳转。

## API

### Anchor Props

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| affix | 固定模式 | boolean | true |  |
| bounds | 锚点区域边界 | number | 5(px) |  |
| getContainer | 指定滚动的容器 | () => HTMLElement | () => window |  |
| getCurrentAnchor | 自定义高亮的锚点 | (activeLink: string) => string | - | activeLink(3.3) |
| offsetBottom | 距离窗口底部达到指定偏移量后触发 | number |  |  |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number |  |  |
| showInkInFixed | `:affix="false"` 时是否显示小方块 | boolean | false |  |
| targetOffset | 锚点滚动偏移量，默认与 offsetTop 相同，[例子](#components-anchor-demo-targetoffset) | number | `offsetTop` | 1.5.0 |
| wrapperClass | 容器的类名 | string | - |  |
| wrapperStyle | 容器样式 | object | - |  |
| items | 数据化配置选项内容，支持通过 children 嵌套 | { key, href, title, target, children }\[] [具体见](#anchoritem) | - | 4.0 |
| direction | 设置导航方向 | `vertical` \| `horizontal` | `vertical` | 4.0 |
| customTitle | 使用插槽自定义选项 title | v-slot="AnchorItem" | - | 4.0 |

### AnchorItem

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标志 | string \| number | - |  |
| href | 锚点链接 | string | - |  |
| target | 该属性指定在何处显示链接的资源 | string | - |  |
| title | 文字内容 | VueNode \| (item: AnchorItem) => VueNode | - |  |
| children | 嵌套的 Anchor Link，`注意：水平方向该属性不支持` | [AnchorItem](#anchoritem)\[] | - |  |

### 事件

| 事件名称 | 说明                   | 回调参数                              | 版本 |       |
| -------- | ---------------------- | ------------------------------------- | ---- | ----- |
| change   | 监听锚点链接改变       | (currentActiveLink: string) => void   |      | 1.5.0 |
| click    | `click` 事件的 handler | Function(e: MouseEvent, link: Object) |      |       |

### Link Props

| 成员   | 说明                             | 类型         | 默认值 | 版本  |
| ------ | -------------------------------- | ------------ | ------ | ----- |
| href   | 锚点链接                         | string       |        |       |
| target | 该属性指定在何处显示链接的资源。 | string       |        | 1.5.0 |
| title  | 文字内容                         | string\|slot |        |       |
