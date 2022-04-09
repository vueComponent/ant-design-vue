---
category: Components
type: Data Display
title: Tabs
cover: https://gw.alipayobjects.com/zos/antfincdn/lkI2hNEDr2V/Tabs.svg
---

Tabs make it easy to switch between different views.

### When To Use

Ant Design has 3 types of Tabs for different situations.

- Card Tabs: for managing too many closeable views.
- Normal Tabs: for functional aspects of a page.
- [RadioButton](/ant-design/components/radio/): for secondary tabs.

## API

### Tabs

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey(v-model) | Current TabPane's key | string | - |  |
| animated | Whether to change tabs with animation. Only works while tabPosition=`"top"` \| `"bottom"` | boolean \| {inkBar:boolean, tabPane:boolean} | `true`, `false` when `type="card"` |  |
| destroyInactiveTabPane | Whether destroy inactive TabPane when change tab | boolean | false |  |
| hideAdd | Hide plus icon or not. Only works while `type="editable-card"` | boolean | `false` | } |
| size | preset tab bar size | `large` \| `default` \| `small` | `default` |  |
| tabBarGutter | The gap between tabs | number | - |  |
| tabBarStyle | Tab bar style object | object | - |  |
| tabPosition | Position of tabs | `top` \| `right` \| `bottom` \| `left` | `top` |  |
| type | Basic style of tabs | `line` \| `card` \| `editable-card` | `line` |  |

### Tabs Slots

| Slot Name    | Description                    | Type              |     |
| ------------ | ------------------------------ | ----------------- | --- |
| addIcon      | Customize add icon             | -                 | -   |
| leftExtra    | Extra content in tab bar left  | -                 | -   |
| moreIcon     | The custom icon of ellipsis    | -                 | -   |
| renderTabBar | Replace the TabBar             | { DefaultTabBar } |     |
| rightExtra   | Extra content in tab bar right | -                 | -   |

### Tabs Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | Callback executed when active tab is changed | Function(activeKey) {} |
| edit | Callback executed when tab is added or removed. Only works while `type="editable-card"` | (targetKey, action): void |
| nextClick | Callback executed when next button is clicked | Function |
| prevClick | Callback executed when prev button is clicked | Function |
| tabClick | Callback executed when tab is clicked | Function |

### Tabs.TabPane

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| forceRender | Forced render of content in tabs, not lazy render after clicking on tabs | boolean | false |
| key | TabPane's key | string | - |
| tab | Show text in TabPane's head | string\|slot | - |

### Tabs.TabPane Slots

| 插槽名称  | 说明                                            | 参数 |
| --------- | ----------------------------------------------- | ---- |
| closeIcon | 自定义关闭图标，`在 type="editable-card"`时有效 | -    |
| tab       | Show text in TabPane's head                     | -    |
