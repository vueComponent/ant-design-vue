---
category: Components
type: Data Display
title: Descriptions
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fHdlTpif6XQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*d27AQJrowGAAAAAAAAAAAAAADrJ8AQ/original
---

Display multiple read-only fields in groups.

## When To Use

Commonly displayed on the details page.

## API

### Descriptions props

| Property | Description | Type | Default | Version |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| bordered | whether to display the border | boolean | false |  |  |  |
| colon | change default props `colon` value of `Descriptions.Item` | boolean | true |  |  |  |
| column | the number of `DescriptionItems` in a row,could be a number or a object like `{ xs: 8, sm: 16, md: 24}`,(Only set `bordered={true}` to take effect) | number | 3 |  |  |  |
| contentStyle | Customize content style | CSSProperties | - | 2.2.0 |  |  |
| extra | The action area of the description list, placed at the top-right | string \| VNode \| slot | - | 2.0.0 |  |  |
| labelStyle | Customize label style | CSSProperties | - | 2.2.0 |  |  |
| layout | Define description layout | `horizontal` \| `vertical` | `horizontal` |  |  |
| size | set the size of the list. Can be set to `middle`,`small`, or not filled | `default` \| `middle` \| `small` | `default` |  |
| title | The title of the description list, placed at the top | string \| VNode \| slot | - |  |  |  |

### Item props

| Property     | Description                    | Type                    | Default | Version |
| ------------ | ------------------------------ | ----------------------- | ------- | ------- |
| contentStyle | Customize content style        | CSSProperties           | -       | 2.2.0   |
| label        | description of the content     | string \| VNode \| slot | -       |         |
| labelStyle   | Customize label style          | CSSProperties           | -       | 2.2.0   |
| span         | The number of columns included | number                  | 1       |         |

> The number of span Descriptions.Item. span={2} takes up the width of two DescriptionsItems.
