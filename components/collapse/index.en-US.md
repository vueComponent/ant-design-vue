## API

### Collapse

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| activeKey | Key of the active panel | string\[]\|string | No default value. In `accordion` mode, it's the key of the first panel. |
| defaultActiveKey | Key of the initial active panel | string | - |
| change | Callback function executed when active panel is changed | Function | - |

### Collapse.Panel

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| disabled | If `true`, panel cannot be opened or closed | boolean | `false` |
| header | Title of the panel | string | - |
| key | Unique key identifying the panel from among its siblings | string | - |
| showArrow | If `false`, panel will not show arrow icon | boolean | `true` |
