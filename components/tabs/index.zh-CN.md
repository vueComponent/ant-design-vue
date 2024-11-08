---
category: Components
subtitle: 标签页
type: 数据展示
title: Tabs
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*72NDQqXkyOEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8HMoTZUoSGoAAAAAAAAAAAAADrJ8AQ/original
---

选项卡切换组件。

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

Ant Design 依次提供了三级选项卡，分别用于不同的场景。

- 卡片式的页签，提供可关闭的样式，常用于容器顶部。
- 标准线条式页签，用于容器内部的主功能切换，这是最常用的 Tabs。
- [RadioButton](/ant-design/components/radio-cn/) 可作为更次级的页签来使用。

## API

### Tabs

| 参数 | 说明 | 类型 | 默认值 | 版本 |  |
| --- | --- | --- | --- | --- | --- |
| activeKey(v-model) | 当前激活 tab 面板的 key | string | - |  |  |
| animated | 是否使用动画切换 Tabs，在 tabPosition=`"top"` \| `"bottom"` 时有效 | boolean \| {inkBar:boolean, tabPane:boolean} | true, 当 type="card" 时为 false |  |
| centered | 标签居中展示 | boolean | false | 3.0 |  |
| destroyInactiveTabPane | 被隐藏时是否销毁 DOM 结构 | boolean | false |  |  |
| hideAdd | 是否隐藏加号图标，在 `type="editable-card"` 时有效 | boolean | false |  |  |
| size | 大小，提供 `large` `middle` 和 `small` 三种大小 | string | `middle` |  |  |
| tabBarGutter | tabs 之间的间隙 | number | - |  |  |
| tabBarStyle | tab bar 的样式对象 | CSSProperties | - |  |  |
| tabPosition | 页签位置，可选值有 `top` `right` `bottom` `left` | string | `top` |  |  |
| type | 页签的基本样式，可选 `line`、`card` `editable-card` 类型 | string | `line` |  |  |

### Tabs 插槽

| 插槽名称     | 说明                            | 参数              |     |
| ------------ | ------------------------------- | ----------------- | --- |
| addIcon      | 自定义添加按钮                  | -                 | -   |
| leftExtra    | tab bar 上左侧额外的元素        | -                 | -   |
| moreIcon     | 自定义折叠 icon                 | -                 | -   |
| renderTabBar | 替换 TabBar，用于二次封装标签头 | { DefaultTabBar } |     |
| rightExtra   | tab bar 上右侧额外的元素        | -                 | -   |

### Tabs 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 切换面板的回调 | Function(activeKey) {} |
| edit | 新增和删除页签的回调，在 `type="editable-card"` 时有效 | (action === 'add' ? event : targetKey, action): void |
| tabClick | tab 被点击的回调 | Function |
| tabScroll | 滚动 TabBar 时触发 | { direction: 'left' \| 'right' \| 'top' \| 'bottom' } |

### Tabs.TabPane

| 参数        | 说明                      | 类型         | 默认值 |
| ----------- | ------------------------- | ------------ | ------ |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean      | false  |
| key         | 对应 activeKey            | string       | -      |
| tab         | 选项卡头显示文字          | string\|slot | -      |

### Tabs.TabPane 插槽

| 插槽名称  | 说明                                            | 参数 |
| --------- | ----------------------------------------------- | ---- |
| closeIcon | 自定义关闭图标，`在 type="editable-card"`时有效 | -    |
| tab       | 选项卡头显示文字                                | -    |
