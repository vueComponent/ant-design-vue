## API

### Descriptions props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | The title of the description list, placed at the top | string \| VNode \| v-slot:title | - |
| bordered | whether to display the border | boolean | false |
| column | the number of `DescriptionItems` in a row,could be a number or a object like `{ xs: 8, sm: 16, md: 24}`,(Only set `bordered={true}` to take effect) | number | 3 |
| size | set the size of the list. Can be set to `middle`,`small`, or not filled | `default | middle | small` | `default` |
| layout | Define description layout | `horizontal | vertical` | `horizontal` |
| colon | change default props `colon` value of `Descriptions.Item` | boolean | true |

### Item props

| Property | Description                    | Type                            | Default |
| -------- | ------------------------------ | ------------------------------- | ------- |
| label    | description of the content     | string \| VNode \| v-slot:label | -       |
| span     | The number of columns included | number                          | 1       |

> The number of span Descriptions.Item. span={2} takes up the width of two DescriptionsItems.
