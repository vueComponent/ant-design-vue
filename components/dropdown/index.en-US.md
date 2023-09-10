---
category: Components
type: Navigation
title: Dropdown
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mBBcQ6goljkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5qm4S4Zgh2QAAAAAAAAAAAAADrJ8AQ/original
---

A dropdown list.

## When To Use

When there are more than a few options to choose from, you can wrap them in a `Dropdown`. By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action.

## API

### Dropdown

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | this value will be merged into placement's config, please refer to the settings [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrow | Whether the dropdown arrow should be open | boolean \| { pointAtCenter: boolean } | false | 3.3.0 |
| destroyPopupOnHide | Whether destroy dropdown when hidden | boolean | false |  |
| disabled | whether the dropdown menu is disabled | boolean | - |  |
| getPopupContainer | to set the container of the dropdown menu. The default is to create a `div` element in `body`, you can reset it to the scrolling area and make a relative reposition. [example](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | Function(triggerNode) | `() => document.body` |  |
| overlay(v-slot) | the dropdown menu | [Menu](/components/menu) | - |  |
| overlayClassName | Class name of the dropdown root element | string | - |  |
| overlayStyle | Style of the dropdown root element | object | - |  |
| placement | placement of pop menu: `bottomLeft` `bottom` `bottomRight` `topLeft` `top` `topRight` | String | `bottomLeft` |  |
| trigger | the trigger mode which executes the drop-down action, hover doesn't work on mobile device | Array&lt;`click`\|`hover`\|`contextmenu`> | `['hover']` |  |
| open(v-model) | whether the dropdown menu is open | boolean | - | 4.0 |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| openChange | a callback function takes an argument: `open`, is executed when the open state is changed. Not trigger when hidden by click item | function(open) | 4.0 |

You should use [Menu](/components/menu/) as `overlay`. The menu items and dividers are also available by using `Menu.Item` and `Menu.Divider`.

> Warning: You must set a unique `key` for `Menu.Item`.
>
> Menu of Dropdown is unselectable by default, you can make it selectable via `<Menu selectable>`.

### Dropdown.Button

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | whether the dropdown menu is disabled | boolean | - |  |
| icon | Icon (appears on the right) | vNode \| slot | - | 1.5.0 |
| loading | Set the loading status of button | boolean \| { delay: number } | false | 3.0 |
| overlay(v-slot) | the dropdown menu | [Menu](/components/menu) | - |  |
| placement | placement of pop menu: `bottomLeft` `bottom` `bottomRight` `topLeft` `top` `topRight` | String | `bottomLeft` |  |
| size | size of the button, the same as [Button](/components/button) | string | `default` |  |
| trigger | the trigger mode which executes the drop-down action | Array&lt;`click`\|`hover`\|`contextmenu`> | `['hover']` |  |
| type | type of the button, the same as [Button](/components/button) | string | `default` |  |
| open(v-model) | whether the dropdown menu is open | boolean | - |  |

### Dropdown.Button events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| click | a callback function, the same as [Button](/components/button), which will be executed when you click the button on the left | Function |  |
| openChange | a callback function takes an argument: `open`, is executed when the open state is changed. Not trigger when hidden by click item | Function | 4.0 |
