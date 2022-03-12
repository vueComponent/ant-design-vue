---
category: Components
type: Other
cols: 2
title: Anchor
cover: https://gw.alipayobjects.com/zos/alicdn/_1-C1JwsC/Anchor.svg
---

Hyperlinks to scroll on one page.

## When To Use

For displaying anchor hyperlinks on page and jumping between them.

## API

### Anchor Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| affix | Fixed mode of Anchor | boolean | true |  |
| bounds | Bounding distance of anchor area | number | 5(px) |  |
| getContainer | Scrolling container | () => HTMLElement | () => window |  |
| getCurrentAnchor | Customize the anchor highlight | () => string | - | 1.5.0 |
| offsetBottom | Pixels to offset from bottom when calculating position of scroll | number | - |  |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | 0 |  |
| showInkInFixed | Whether show ink-balls when `：affix="false"` | boolean | false |  |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#components-anchor-demo-targetOffset) | number | `offsetTop` | 1.5.0 |
| wrapperClass | The class name of the container | string | - |  |
| wrapperStyle | The style of the container | object | - |  |

### Events

| Events Name | Description | Arguments | Version |  |
| --- | --- | --- | --- | --- |
| change | Listening for anchor link change | (currentActiveLink: string) => void |  | 1.5.0 |
| click | set the handler to handle `click` event | Function(e: Event, link: Object) |  |  |

### Link Props

| Property | Description                               | Type         | Default | Version |
| -------- | ----------------------------------------- | ------------ | ------- | ------- |
| href     | target of hyperlink                       | string       |         |         |
| target   | Specifies where to display the linked URL | string       |         | 1.5.0   |
| title    | content of hyperlink                      | string\|slot |         |         |
