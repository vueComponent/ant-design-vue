## API

```html
<template>
  <a-menu>
    <a-menu-item>菜单项</a-menu-item>
    <a-sub-menu title="子菜单">
      <a-menu-item>子菜单项</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
```

### Menu

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| defaultOpenKeys | array with the keys of default opened sub menus |  |  |
| defaultSelectedKeys | array with the keys of default selected menu items | string\[] |  |
| forceSubMenuRender | render submenu into DOM before it shows | boolean | false |
| inlineCollapsed | specifies the collapsed status when menu is inline mode | boolean | - |
| inlineIndent | indent px of inline menu item on each level | number | 24 |
| mode | type of the menu; `vertical`, `horizontal`, and `inline` modes are supported | string: `vertical` \| `vertical-right` \| `horizontal` \| `inline` | `vertical` |
| multiple | Allow selection of multiple items | boolean | false |
| openKeys(.sync) | array with the keys of currently opened sub menus | string\[] |  |
| selectable | allow selecting menu items | boolean | true |
| selectedKeys(v-model) | array with the keys of currently selected menu items | string\[] |  |
| style | style of the root node | object |  |
| subMenuCloseDelay | delay time to hide submenu when mouse leave, unit: second | number | 0.1 |
| subMenuOpenDelay | delay time to show submenu when mouse enter, unit: second | number | 0 |
| theme | color theme of the menu | string: `light` `dark` | `light` |

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

| Param    | Description                         | Type         | Default value |
| -------- | ----------------------------------- | ------------ | ------------- |
| disabled | whether sub menu is disabled or not | boolean      | false         |
| key      | unique id of the sub menu           | string       |               |
| title    | title of the sub menu               | string\|slot |               |

The children of Menu.SubMenu must be `MenuItem` or `SubMenu`.

### Menu.SubMenu Events

| Events Name | Description                                          | Arguments                   |
| ----------- | ---------------------------------------------------- | --------------------------- |
| titleClick  | callback executed when the sub menu title is clicked | function({ key, domEvent }) |

### Menu.ItemGroup

| Param    | Description        | Type         | Default value |
| -------- | ------------------ | ------------ | ------------- |
| children | sub menu items     | MenuItem\[]  |               |
| title    | title of the group | string\|slot |               |

The children of Menu.ItemGroup must be `MenuItem`.

### Menu.Divider

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu.
