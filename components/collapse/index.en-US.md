## API

### Collapse

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| accordion | If `true`, `Collapse` renders as `Accordion` | boolean | `false` |
| activeKey(v-model) | Key of the active panel | string\[]\|string | No default value. In `accordion` mode, it's the key of the first panel. |
| bordered | Toggles rendering of the border around the collapse block | boolean | `true` |
| defaultActiveKey | Key of the initial active panel | string | - |
| destroyInactivePanel | Destroy Inactive Panel | boolean | `false` |

### events
| Events Name | Description | Arguments |
| --- | --- | --- |
| change | Callback function executed when active panel is changed  | function(key) |

### Collapse.Panel

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| disabled | If `true`, panel cannot be opened or closed | boolean | `false` |
| forceRender | Forced render of content on panel, instead of lazy rending after clicking on header | boolean | `false` |
| header | Title of the panel | string | - |
| key | Unique key identifying the panel from among its siblings | string | - |
| showArrow | If `false`, panel will not show arrow icon | boolean | `true` |
