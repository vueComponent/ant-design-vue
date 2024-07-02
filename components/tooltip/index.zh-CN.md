---
category: Components
type: 数据展示
title: Tooltip
subtitle: 文字提示
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3u9eSZO_4c0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gwrhTozoTC4AAAAAAAAAAAAADrJ8AQ/original
---

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## API

| 参数  | 说明     | 类型         | 默认值 |
| ----- | -------- | ------------ | ------ |
| title | 提示文字 | string\|slot | -      |

### 共同的 API

以下 API 为 Tooltip、Popconfirm、Popover 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 该值将合并到 placement 的配置中，设置参考 [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrowPointAtCenter | 箭头是否指向目标元素中心 | boolean | `false` |  |
| arrow | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean \| { pointAtCenter: boolean} | `true` | 4.2.0 |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | `true` |  |
| color | 背景颜色 | string | - |  |
| destroyTooltipOnHide | 隐藏后是否销毁 tooltip | boolean | false |  |
| getPopupContainer | 浮层渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| mouseEnterDelay | 鼠标移入后延时多少才显示 Tooltip，单位：秒 | number | 0.1 |  |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | number | 0.1 |  |
| overlayClassName | 卡片类名 | string | - |  |
| overlayStyle | 卡片样式 | object | - |  |
| overlayInnerStyle | 卡片内容区域样式 | object | - | 4.0 |
| placement | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | top |  |
| trigger | 触发行为，可选 `hover/focus/click/contextmenu` | string | hover |  |
| open(v-model) | 用于手动控制浮层显隐, 小于 4.0.0 使用 `visible` | boolean | false | 4.0 |

### 事件

| 事件名称   | 说明           | 回调参数          | 版本 |
| ---------- | -------------- | ----------------- | ---- |
| openChange | 显示隐藏的回调 | (visible) => void | 4.0  |

## 注意

请确保 `Tooltip` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
