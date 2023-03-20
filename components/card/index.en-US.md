---
category: Components
type: Data Display
title: Card
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VXtCTp93KPAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-8zR6rrupgAAAAAAAAAAAAADrJ8AQ/original
---

Simple rectangular container.

## When To Use

A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.

## API

### Card

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeTabKey | Current TabPane's key | string | - |  |
| bodyStyle | Inline style to apply to the card content | object | - |  |
| bordered | Toggles rendering of the border around the card | boolean | `true` |  |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set. | string | - |  |
| extra | Content to render in the top-right corner of the card | string\|slot | - |  |
| headStyle | Inline style to apply to the card head | object | - |  |
| hoverable | Lift up when hovering card | boolean | false |  |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false |  |
| size | Size of card | `default` \| `small` | `default` |  |
| tabList | List of TabPane's head, Custom tabs with the customTab(v3.0) slot | Array&lt;{key: string, tab: any}> | - |  |
| title | Card title | string\|slot | - |  |
| type | Card style type, can be set to `inner` or not set | string | - |  |

### Card Slots

| Slot Name | Description | Type |  |
| --- | --- | --- | --- |
| actions | The action list, shows at the bottom of the Card. | - |  |
| cover | Card cover | - |  |
| customTab | custom tabList tab | { item: tabList[number] } |  |
| extra | Content to render in the top-right corner of the card | - |  |
| tabBarExtraContent | Extra content in tab bar | - |  |
| title | Card title | - |  |

### events

| Events Name | Description                   | Arguments     | Version |     |
| ----------- | ----------------------------- | ------------- | ------- | --- |
| tabChange   | Callback when tab is switched | (key) => void | -       |     |

### Card.Grid

### Card.Meta

| Property    | Description         | Type         | Default | Version |
| ----------- | ------------------- | ------------ | ------- | ------- |
| avatar      | avatar or icon      | slot         | -       |         |
| description | description content | string\|slot | -       |         |
| title       | title content       | string\|slot | -       |         |
