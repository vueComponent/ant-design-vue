## API

### Tabs

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| activeKey(v-model) | Current TabPane's key | string | - |
| animated | Whether to change tabs with animation. Only works while `tabPosition="top"\|"bottom"` | boolean \| {inkBar:boolean, tabPane:boolean} | `true`, `false` when `type="card"` |
| defaultActiveKey | Initial active TabPane's key, if `activeKey` is not set. | string | - |
| hideAdd | Hide plus icon or not. Only works while `type="editable-card"` | boolean | `false` |
| size | preset tab bar size | `large` \| `default` \| `small` | `default` |
| tabBarExtraContent | Extra content in tab bar | slot | - |
| tabBarStyle | Tab bar style object | object | - |
| tabPosition | Position of tabs | `top` \| `right` \| `bottom` \| `left` | `top` |
| type | Basic style of tabs | `line` \| `card` \| `editable-card` | `line` |
| tabBarGutter | The gap between tabs | number | - |

### Events

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
