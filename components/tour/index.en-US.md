---
category: Components
type: Data Display
title: Tour
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8CC_Tbe3_e4AAAAAAAAAAAAADrJ8AQ/original
---

## Tour

category: Components group: Data Display title: Tour cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8CC_Tbe3_e4AAAAAAAAAAAAADrJ8AQ/original coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*nF6hQpM0XtEAAAAAAAAAAAAADrJ8AQ/original demo: cols: 2

---

A popup component for guiding users through a product.

## When To Use

Use when you want to guide users through a product.

## API

### Tour

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean`\|`{ pointAtCenter: boolean}` | `true` |  |
| placement | Position of the guide card relative to the target element | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| onClose | Callback function on shutdown | `Function` | - |  |
| mask | Whether to enable masking, change mask style and fill color by pass custom props | `boolean \| { style?: React.CSSProperties; color?: string; }` | `true` |  |
| type | Type, affects the background color and text color | `default` `primary` | `default` |  |
| open | Open tour | `boolean` | - |  |
| onChange | Callback when the step changes. Current is the previous step | `(current: number) => void` | - |  |
| current | What is the current step | `number` | - |  |
| scrollIntoViewOptions | support pass custom scrollIntoView options | `boolean \| ScrollIntoViewOptions` | `true` |  |
| indicatorsRender | custom indicator | `(current: number, total: number) => ReactNode` | - |  |

### TourStep

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| target | Get the element the guide card points to. Empty makes it show in center of screen | `() => HTMLElement` `HTMLElement` | - |  |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean` `{ pointAtCenter: boolean}` | `true` |  |
| cover | Displayed pictures or videos | `ReactNode` | - |  |
| title | title | `ReactNode` | - |  |
| description | description | `ReactNode` | - |  |
| placement | Position of the guide card relative to the target element | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| onClose | Callback function on shutdown | `Function` | - |  |
| mask | Whether to enable masking, change mask style and fill color by pass custom props, the default follows the `mask` property of Tour | `boolean \| { style?: React.CSSProperties; color?: string; }` | `true` |  |
| type | Type, affects the background color and text color | `default` `primary` | `default` |  |
| nextButtonProps | Properties of the Next button | `{ children: ReactNode; onClick: Function }` | - |  |
| prevButtonProps | Properties of the previous button | `{ children: ReactNode; onClick: Function }` | - |  |
| scrollIntoViewOptions | support pass custom scrollIntoView options, the default follows the `scrollIntoViewOptions` property of Tour | `boolean \| ScrollIntoViewOptions` | `true` |  |
