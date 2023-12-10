---
category: Components
type: 数据展示
title: Tour
subtitle: 漫游式引导
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8CC_Tbe3_e4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*nF6hQpM0XtEAAAAAAAAAAAAADrJ8AQ/original
tag: New
---

用于分步引导用户了解产品功能的气泡组件。自 `4.0.0` 版本开始提供该组件。

## 何时使用

常用于引导用户了解产品功能。

## API

### Tour

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | `boolean` \| `{ pointAtCenter: boolean}` | `true` |  |
| placement | 引导卡片相对于目标元素的位置 | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色 | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| type | 类型，影响底色与文字颜色 | `default` \| `primary` | `default` |  |
| open | 打开引导 | `boolean` | - |  |
| current(v-model) | 当前处于哪一步 | `number` | - |  |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数 | `boolean` \| `ScrollIntoViewOptions` | `true` |  |
| indicatorsRender | 自定义指示器 | `v-slot:indicatorsRender="{current, total}"` | - |  |
| zIndex | Tour 的层级 | `number` | `1001` |  |

### Tour events

| 事件名称 | 说明                                     | 回调参数                    | 版本 |
| -------- | ---------------------------------------- | --------------------------- | ---- | --- |
| close    | 关闭引导时的回调函数                     | `Function`                  | -    |     |
| finish   | 引导完成时的回调                         | `Function`                  | -    |     |
| change   | 步骤改变时的回调，current 为当前前的步骤 | `(current: number) => void` | -    |     |

### TourStep 引导步骤卡片

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| target | 获取引导卡片指向的元素，为空时居中于屏幕 | `() => HTMLElement` \| `HTMLElement` | - |  |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | `boolean` \| `{ pointAtCenter: boolean}` | `true` |  |
| cover | 展示的图片或者视频 | `VueNode` | - |  |
| title | 标题 | `VueNode` | - |  |
| description | 主要描述部分 | `VueNode` | - |  |
| placement | 引导卡片相对于目标元素的位置 | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` `bottom` |  |  |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色，默认跟随 Tour 的 `mask` 属性 | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| type | 类型，影响底色与文字颜色 | `default` \| `primary` | `default` |  |
| nextButtonProps | 下一步按钮的属性 | `{ children: VueNode; onClick: Function }` | - |  |
| prevButtonProps | 上一步按钮的属性 | `{ children: VueNode; onClick: Function }` | - |  |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数，默认跟随 Tour 的 `scrollIntoViewOptions` 属性 | `boolean` \| `ScrollIntoViewOptions` | `true` |  |

### TourStep events

| 事件名称 | 说明                 | 回调参数   | 版本 |
| -------- | -------------------- | ---------- | ---- | --- |
| close    | 关闭引导时的回调函数 | `Function` | -    |     |
