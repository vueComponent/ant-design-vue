---
category: Components
cols: 1
type: 导航
title: Menu
subtitle: 导航菜单
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KeyQQL5iKkkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Vn4XSqJFAxcAAAAAAAAAAAAADrJ8AQ/original
---

为页面和功能提供导航的菜单列表。

## 何时使用

导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。

更多布局和导航的使用可以参考：[通用布局](/components/layout-cn)。

## 开发者注意事项

- Menu 元素为 `ul`，因而仅支持 [`li` 以及 `script-supporting` 子元素](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element)。因而你的子节点元素应该都在 `Menu.Item` 内使用。
- Menu 需要计算节点结构，因而其子元素仅支持 `Menu.*` 以及对此进行封装的 HOC 组件。
- 必须为 SubMenu 设置唯一 key

## API

### Menu

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| forceSubMenuRender | 在子菜单展示之前就渲染进 DOM | boolean | false |
| inlineCollapsed | inline 时菜单是否收起状态 | boolean | - |
| inlineIndent | inline 模式的菜单缩进宽度 | number | 24 |
| items | 菜单内容 | [ItemType\[\]](#itemtype) | - |  |
| mode | 菜单类型，现在支持垂直、水平、和内嵌模式三种 | `vertical` \| `horizontal` \| `inline` | `vertical` |
| multiple | 是否允许多选 | boolean | false |
| openKeys(v-model) | 当前展开的 SubMenu 菜单项 key 数组 | (string \| number)[] |  |
| overflowedIndicator | 用于自定义 Menu 水平空间不足时的省略收缩的图标 | slot | `<EllipsisOutlined />` |
| selectable | 是否允许选中 | boolean | true |
| selectedKeys(v-model) | 当前选中的菜单项 key 数组 | (string \| number)[] |  |
| subMenuCloseDelay | 用户鼠标离开子菜单后关闭延时，单位：秒 | number | 0.1 |
| subMenuOpenDelay | 用户鼠标进入子菜单后开启延时，单位：秒 | number | 0 |
| theme | 主题颜色 | `light` \| `dark` | `light` |
| triggerSubMenuAction | 修改 Menu 子菜单的触发方式 | `click` \| `hover` | `hover` |

### Menu 事件

| 事件名称   | 说明                               | 回调参数                                 |
| ---------- | ---------------------------------- | ---------------------------------------- |
| click      | 点击 MenuItem 调用此函数           | function({ item, key, keyPath })         |
| deselect   | 取消选中时调用，仅在 multiple 生效 | function({ item, key, selectedKeys })    |
| openChange | SubMenu 展开/关闭的回调            | function(openKeys: (string \| number)[]) |
| select     | 被选中时调用                       | function({ item, key, selectedKeys })    |

### Menu.Item

| 参数     | 说明                     | 类型             | 默认值 | 版本  |
| -------- | ------------------------ | ---------------- | ------ | ----- |
| disabled | 是否禁用                 | boolean          | false  |       |
| icon     | 菜单图标                 | slot             |        | 2.8.0 |
| key      | item 的唯一标志          | string \| number |        |       |
| title    | 设置收缩时展示的悬浮标题 | string \| slot   |        |       |

### ItemType

> type ItemType = [MenuItemType](#menuitemtype) | [SubMenuType](#submenutype) | [MenuItemGroupType](#menuitemgrouptype) | [MenuDividerType](#menudividertype);

### MenuItemType

| 参数     | 说明                     | 类型                                   | 默认值 | 版本 |
| -------- | ------------------------ | -------------------------------------- | ------ | ---- |
| danger   | 展示错误状态样式         | boolean                                | false  |      |
| disabled | 是否禁用                 | boolean                                | false  |      |
| icon     | 菜单图标                 | VueNode\|(item: MenuItemType)=>VueNode | -      |      |
| key      | item 的唯一标志          | string \| number                       | -      |      |
| label    | 菜单项标题               | VueNode                                | -      |      |
| title    | 设置收缩时展示的悬浮标题 | string                                 | -      |      |

#### SubMenuType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 子菜单的菜单项 | [ItemType\[\]](#itemtype) | - |  |
| disabled | 是否禁用 | boolean | false |  |
| icon | 菜单图标 | VueNode\|(item: SubMenuType)=>VueNode | - |  |
| key | 唯一标志 | string \| number | - |  |
| label | 菜单项标题 | VueNode | - |  |
| popupClassName | 子菜单样式，`mode="inline"` 时无效 | string | - |  |
| popupOffset | 子菜单偏移量，`mode="inline"` 时无效 | \[number, number] | - |  |
| onTitleClick | 点击子菜单标题 | function({ key, domEvent }) | - |  |
| theme | 设置子菜单的主题，默认从 Menu 上继承 | `light` \| `dark` | - |  |

#### MenuItemGroupType

定义类型为 `group` 时，会作为分组处理:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
};
```

| 参数     | 说明         | 类型                              | 默认值 | 版本 |
| -------- | ------------ | --------------------------------- | ------ | ---- |
| children | 分组的菜单项 | [MenuItemType\[\]](#menuitemtype) | -      |      |
| label    | 分组标题     | VueNode                           | -      |      |

#### MenuDividerType

菜单项分割线，只用在弹出菜单内，需要定义类型为 `divider`：

```ts
const dividerItem = {
  type: 'divider', // Must have
};
```

| 参数   | 说明     | 类型    | 默认值 | 版本 |
| ------ | -------- | ------- | ------ | ---- |
| dashed | 是否虚线 | boolean | false  |      |

### Menu.SubMenu

| 参数           | 说明                                 | 类型              | 默认值   | 版本  |
| -------------- | ------------------------------------ | ----------------- | -------- | ----- |
| disabled       | 是否禁用                             | boolean           | false    |       |
| expandIcon     | 自定义 Menu 展开收起图标             | slot              | 箭头图标 |       |
| icon           | 菜单图标                             | slot              |          | 2.8.0 |
| key            | 唯一标志, 必填                       | string \| number  |          |       |
| popupClassName | 子菜单样式                           | string            |          | 1.5.0 |
| popupOffset    | 子菜单偏移量，`mode="inline"` 时无效 | \[number, number] | -        |       |
| title          | 子菜单项值                           | string\|slot      |          |       |

Menu.SubMenu 的子元素必须是 `MenuItem` 或者 `SubMenu`.

`SubMenu` 必须传递 key，如不传递，该 SubMenu 下子元素将提前渲染，而且部分场景无法进行有效高亮。

### SubMenu 事件

| 事件名称   | 说明           | 回调参数            |
| ---------- | -------------- | ------------------- |
| titleClick | 点击子菜单标题 | ({ key, domEvent }) |

### Menu.ItemGroup

| 参数  | 说明     | 类型         | 默认值 |
| ----- | -------- | ------------ | ------ |
| title | 分组标题 | string\|slot |        |

Menu.ItemGroup 的子元素必须是 `MenuItem`.

### Menu.Divider

菜单项分割线，只用在弹出菜单内。

| 参数   | 说明     | 类型    | 默认值 | 版本 |
| ------ | -------- | ------- | ------ | ---- |
| dashed | 是否虚线 | boolean | false  | 3.0  |

## FAQ

### 为何 Menu 的子元素会渲染两次？

Menu 通过二次渲染收集嵌套结构信息以支持 HOC 的结构。合并成一个推导结构会使得逻辑变得十分复杂，欢迎 PR 以协助改进该设计。
