---
category: Components
type: Data Display
title: Card
cover: https://gw.alipayobjects.com/zos/antfincdn/NqXt8DJhky/Card.svg
---

Simple rectangular container.

## When To Use

A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.

## API

### Card

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeTabKey | Current TabPane's key | string | - |  |
| headStyle | Inline style to apply to the card head | object | - |  |
| bodyStyle | Inline style to apply to the card content | object | - |  |
| bordered | Toggles rendering of the border around the card | boolean | `true` |  |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set. | string | - |  |
| extra | Content to render in the top-right corner of the card | string\|slot | - |  |
| hoverable | Lift up when hovering card | boolean | false |  |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false |  |
| tabList | List of TabPane's head, Custom tabs with the customTab(v3.0) slot | Array&lt;{key: string, tab: any}&gt; | - |  |
| size | Size of card | `default` \| `small` | `default` |  |
| title | Card title | string\|slot | - |  |
| type | Card style type, can be set to `inner` or not set | string | - |  |

### Card Slots

| Slot Name | Description | Type |
| --- | --- | --- | --- |
| customTab | custom tabList tab | { item: tabList[number] } |  |
| title | Card title | - |  |
| extra | Content to render in the top-right corner of the card | - |  |
| tabBarExtraContent | Extra content in tab bar | - |  |
| actions | The action list, shows at the bottom of the Card. | - |  |
| cover | Card cover | - |  |

### events

| Events Name | Description                   | Arguments     | Version |
| ----------- | ----------------------------- | ------------- | ------- | --- |
| tabChange   | Callback when tab is switched | (key) => void | -       |     |

### Card.Grid

### Card.Meta

| Property    | Description         | Type         | Default | Version |
| ----------- | ------------------- | ------------ | ------- | ------- |
| avatar      | avatar or icon      | slot         | -       |         |
| description | description content | string\|slot | -       |         |
| title       | title content       | string\|slot | -       |         |
