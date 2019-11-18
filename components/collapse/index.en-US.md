## API

### Collapse

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| activeKey | Key of the active panel | string\[]\|string | No default value. In `accordion` mode, it's the key of the first panel. |
| defaultActiveKey | Key of the initial active panel | string | - |
| bordered | Toggles rendering of the border around the collapse block | boolean | `true` |
| accordion | If `true`, `Collapse` renders as `Accordion` | boolean | `false` |
| expandIcon | allow to customize collapse icon | Function(props):VNode \| slot="expandIcon" slot-scope="props"\|v-slot:expandIcon="props" |
| destroyInactivePanel | Destroy Inactive Panel | boolean | `false` |

### events

| Events Name | Description                                             | Arguments     |
| ----------- | ------------------------------------------------------- | ------------- |
| change      | Callback function executed when active panel is changed | function(key) |

### Collapse.Panel

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| disabled | If `true`, panel cannot be opened or closed | boolean | `false` |
| forceRender | Forced render of content on panel, instead of lazy rending after clicking on header | boolean | `false` |
| header | Title of the panel | string | - |
| key | Unique key identifying the panel from among its siblings | string | - |
| showArrow | If `false`, panel will not show arrow icon | boolean | `true` |

## FAQ

### How to let the arrow to be on the right?

You can adjust style of the arrow:

```
.ant-collapse .ant-collapse-item .ant-collapse-header .anticon {
  left: initial;
  right: 16px;
}
```
