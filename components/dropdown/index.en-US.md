## API

### Dropdown

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| disabled | whether the dropdown menu is disabled | boolean | - |
| getPopupContainer | to set the container of the dropdown menu. The default is to create a `div` element in `body`, you can reset it to the scrolling area and make a relative reposition. [example](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | Function(triggerNode) | `() => document.body` |
| overlay(slot-scope) | the dropdown menu | [Menu](/components/menu) | - |
| overlayClassName | Class name of the dropdown root element | string | - |
| overlayStyle | Style of the dropdown root element | object | - |
| placement | placement of pop menu: `bottomLeft` `bottomCenter` `bottomRight` `topLeft` `topCenter` `topRight` | String | `bottomLeft` |
| trigger | the trigger mode which executes the drop-down action, hover doesn't work on mobile device | Array&lt;`click`\|`hover`\|`contextmenu`> | `['hover']` |
| visible(v-model) | whether the dropdown menu is visible | boolean | - |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| visibleChange | a callback function takes an argument: `visible`, is executed when the visible state is changed | function(visible) |

You should use [Menu](/components/menu/) as `overlay`. The menu items and dividers are also available by using `Menu.Item` and `Menu.Divider`.

> Warning: You must set a unique `key` for `Menu.Item`.
>
> Menu of Dropdown is unselectable by default, you can make it selectable via `<Menu selectable>`.

### Dropdown.Button

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| disabled | whether the dropdown menu is disabled | boolean | - |
| overlay(slot-scope) | the dropdown menu | [Menu](/components/menu) | - |
| placement | placement of pop menu: `bottomLeft` `bottomCenter` `bottomRight` `topLeft` `topCenter` `topRight` | String | `bottomLeft` |
| size | size of the button, the same as [Button](/components/button) | string | `default` |
| trigger | the trigger mode which executes the drop-down action | Array&lt;`click`\|`hover`\|`contextmenu`> | `['hover']` |
| type | type of the button, the same as [Button](/components/button) | string | `default` |
| visible | whether the dropdown menu is visible | boolean | - |

### Dropdown.Button events

| Events Name | Description | Arguments |
| --- | --- | --- |
| click | a callback function, the same as [Button](/components/button), which will be executed when you click the button on the left | Function |
| visibleChange | a callback function takes an argument: `visible`, is executed when the visible state is changed | Function |
