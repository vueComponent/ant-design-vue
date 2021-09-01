---
category: Components
cols: 1
type: Navigation
title: Menu
cover: https://gw.alipayobjects.com/zos/alicdn/3XZcjGpvK/Menu.svg
---

A versatile menu for navigation.

## When To Use

Navigation is an important part of any website, as a good navigation setup allows users to move around the site quickly and efficiently. Ant Design offers top and side navigation options. Top navigation provides all the categories and functions of the website. Side navigation provides the multi-level structure of the website.

More layouts with navigation: [Layout](/components/layout).

## API

```html
<template>
  <a-menu>
    <a-menu-item>Menu</a-menu-item>
    <a-sub-menu title="SubMenu">
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
| mode | type of the menu; `vertical`, `horizontal`, and `inline` modes are supported | string: `vertical` \| `vertical-right` \| `horizontal` \| `inline` | `vertical` |
| multiple | Allow selection of multiple items | boolean | false |
| openKeys(v-model) | array with the keys of currently opened sub menus | string\[] |  |
| selectable | allow selecting menu items | boolean | true |
| selectedKeys(v-model) | array with the keys of currently selected menu items | string\[] |  |
| style | style of the root node | object |  |
| subMenuCloseDelay | delay time to hide submenu when mouse leave, unit: second | number | 0.1 |
| subMenuOpenDelay | delay time to show submenu when mouse enter, unit: second | number | 0 |
| theme | color theme of the menu | string: `light` `dark` | `light` |
| overflowedIndicator | Customized icon when menu is collapsed | DOM | `<span>···</span>` |

### Menu Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| click | callback executed when a menu item is clicked | function({ item, key, keyPath }) |
| deselect | callback executed when a menu item is deselected, only supported for multiple mode | function({ item, key, selectedKeys }) |
| openChange | called when open/close sub menu | function(openKeys: string\[]) |
| select | callback executed when a menu item is selected | function({ item, key, selectedKeys }) |

### Menu.Item

| Param    | Description                          | Type    | Default value |
| -------- | ------------------------------------ | ------- | ------------- |
| disabled | whether menu item is disabled or not | boolean | false         |
| key      | unique id of the menu item           | string  |               |
| title    | set display title for collapsed item | string  |               |

### Menu.SubMenu

| Param          | Description                         | Type         | Default value | Version |
| -------------- | ----------------------------------- | ------------ | ------------- | ------- |
| popupClassName | Sub-menu class name                 | string       |               | 1.5.0   |
| disabled       | whether sub menu is disabled or not | boolean      | false         |         |
| key            | Unique ID of the sub menu           | string       |               |         |
| title          | title of the sub menu               | string\|slot |               |         |
| expandIcon     | Customized expandIcon               | slot         | arrow icon    | ｜      |

The children of Menu.SubMenu must be `MenuItem` or `SubMenu`.

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
