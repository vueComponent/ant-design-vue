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
| offsetBottom | Pixels to offset from bottom when calculating position of scroll | number | - |  |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | 0 |  |
| showInkInFixed | Whether show ink-balls when `：affix="false"` | boolean | false |  |
| wrapperClass | The class name of the container | string | - |  |
| wrapperStyle | The style of the container | object | - |  |
| getCurrentAnchor | Customize the anchor highlight | () => string | - | 1.5.0 |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#components-anchor-demo-targetOffset) | number | `offsetTop` | 1.5.0 |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| click | set the handler to handle `click` event | Function(e: Event, link: Object) |  |
| change | Listening for anchor link change | (currentActiveLink: string) => void |  | 1.5.0 |

### Link Props

| Property | Description                               | Type         | Default | Version |
| -------- | ----------------------------------------- | ------------ | ------- | ------- |
| href     | target of hyperlink                       | string       |         |         |
| title    | content of hyperlink                      | string\|slot |         |         |
| target   | Specifies where to display the linked URL | string       |         | 1.5.0   |
