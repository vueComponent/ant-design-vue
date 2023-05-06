---
category: Components
type: Data Display
title: Popover
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XhL3QpRw92kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*RMP_TrdZ3nsAAAAAAAAAAAAADrJ8AQ/original
---

The floating card popped by clicking or hovering.

## When To Use

A simple popup menu to provide extra information or operations.

Comparing with `Tooltip`, besides information `Popover` card can also provide action elements like links and buttons.

## API

| Param   | Description         | Type                | Default value | Version |
| ------- | ------------------- | ------------------- | ------------- | ------- |
| content | Content of the card | string\|slot\|vNode | -             |         |
| title   | Title of the card   | string\|slot\|VNode | -             |         |

Consult [Tooltip's documentation](/components/tooltip/#api) to find more APIs.

## Note

Please ensure that the child node of `Popover` accepts `onMouseenter`, `onMouseleave`, `onFocus`, `onClick` events.
