---
category: Components
cols: 1
type: Navigation
title: Menu
cover: https://gw.alipayobjects.com/zos/alicdn/3XZcjGpvK/Menu.svg
---

A versatile menu for navigation.

## When To Use

Navigation is an important part of any website, as a good navigation setup allows users to move around the site quickly and efficiently. Ant Design offers two navigation options: top and side. Top navigation provides all the categories and functions of the website. Side navigation provides the multi-level structure of the website.

More layouts with navigation: [Layout](/components/layout).

## Notes for developers

- Menu is rendered as a `ul` element, so it only supports [`li` and `script-supporting` elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element) as children nodes。Your customized node should be wrapped by `Menu.Item`.
- Menu needs to collect its node structure, so its children should be `Menu.*` or encapsulated HOCs.
- Must set unique key for `SubMenu`

## API

```html
<template>
  <a-menu>
    <a-menu-item>Menu</a-menu-item>
    <a-sub-menu key="sub1" title="SubMenu">
      <a-menu-item>SubMenuItem</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
```

### Menu

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| forceSubMenuRender | render submenu into DOM before it shows | boolean | false |
| inlineCollapsed | specifies the collapsed status when menu is inline mode | boolean | - |
| inlineIndent | indent px of inline menu item on each level | number | 24 |
| mode | type of the menu; `vertical`, `horizontal`, and `inline` modes are supported | `vertical` \| `horizontal` \| `inline` | `vertical` |
| multiple | Allow selection of multiple items | boolean | false |
| openKeys(v-model) | array with the keys of currently opened sub menus | string\[] |  |
| overflowedIndicator | Customized the ellipsis icon when menu is collapsed horizontally | slot | `<EllipsisOutlined />` |
| selectable | allow selecting menu items | boolean | true |
| selectedKeys(v-model) | array with the keys of currently selected menu items | string\[] |  |
| style | style of the root node | object |  |
| subMenuCloseDelay | delay time to hide submenu when mouse leave, unit: second | number | 0.1 |
| subMenuOpenDelay | delay time to show submenu when mouse enter, unit: second | number | 0 |
| theme | color theme of the menu | `light` \| `dark` | `light` |
| triggerSubMenuAction | method of trigger submenu | `click` \| `hover` | `hover` |

### Menu Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| click | callback executed when a menu item is clicked | function({ item, key, keyPath }) |
| deselect | callback executed when a menu item is deselected, only supported for multiple mode | function({ item, key, selectedKeys }) |
| openChange | called when open/close sub menu | function(openKeys: string\[]) |
| select | callback executed when a menu item is selected | function({ item, key, selectedKeys }) |

### Menu.Item

| Param    | Description                          | Type           | Default value |
| -------- | ------------------------------------ | -------------- | ------------- |
| disabled | whether menu item is disabled or not | boolean        | false         |
| key      | unique id of the menu item           | string         |               |
| title    | set display title for collapsed item | string \| slot |               |

### Menu.SubMenu

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| disabled | whether sub menu is disabled or not | boolean | false |  |
| expandIcon | Customized expandIcon | slot | arrow icon | ｜ |
| key | Unique ID of the sub menu, required | string |  |  |
| popupClassName | Sub-menu class name | string |  | 1.5.0 |
| popupOffset | Sub-menu offset, not working when `mode="inline"` | \[number, number] | - |  |
| title | title of the sub menu | string\|slot |  |  |

The children of Menu.SubMenu must be `MenuItem` or `SubMenu`.

`SubMenu` must pass the key. If it is not passed, the sub-elements under the SubMenu will be rendered in advance, and some scenes cannot be effectively highlighted.

### Menu.SubMenu Events

| Events Name | Description                                          | Arguments                   |
| ----------- | ---------------------------------------------------- | --------------------------- |
| titleClick  | callback executed when the sub menu title is clicked | function({ key, domEvent }) |

### Menu.ItemGroup

| Param    | Description        | Type         | Default value |
| -------- | ------------------ | ------------ | ------------- |
| children | sub-menu items     | MenuItem\[]  |               |
| title    | title of the group | string\|slot |               |

The children of Menu.ItemGroup must be `MenuItem`.

### Menu.Divider

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu.

| Param  | Description            | Type    | Default value | Version |
| ------ | ---------------------- | ------- | ------------- | ------- |
| dashed | Whether line is dashed | boolean | false         | 4.17.0  |

## FAQ

### Why will Menu's children be rendered twice?

Menu collects structure info with twice-render to support HOC usage. Merging into one render may cause the logic to become much more complex. Contributions to help improve the collection logic are welcomed.
