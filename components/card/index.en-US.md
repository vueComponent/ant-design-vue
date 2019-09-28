## API

### Card

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| actions | The action list, shows at the bottom of the Card. | slots | - |
| activeTabKey | Current TabPane's key | string | - |
| headStyle | Inline style to apply to the card head | object | - |
| bodyStyle | Inline style to apply to the card content | object | - |
| bordered | Toggles rendering of the border around the card | boolean | `true` |
| cover | Card cover | slot | - |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set. | string | - |
| extra | Content to render in the top-right corner of the card | string\|slot | - |
| hoverable | Lift up when hovering card | boolean | false |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false |
| tabList | List of TabPane's head, Custom tabs can be created with the scopedSlots property | Array<{key: string, tab: any, scopedSlots: {tab: 'XXX'}}> | - |
| size | Size of card | `default` \| `small` | `default` |
| title | Card title | string\|slot | - |
| type | Card style type, can be set to `inner` or not set | string | - |

### events

| Events Name | Description                   | Arguments     |
| ----------- | ----------------------------- | ------------- |
| tabChange   | Callback when tab is switched | (key) => void | - |

### Card.Grid

### Card.Meta

| Property    | Description         | Type         | Default |
| ----------- | ------------------- | ------------ | ------- |
| avatar      | avatar or icon      | slot         | -       |
| description | description content | string\|slot | -       |
| title       | title content       | string\|slot | -       |
