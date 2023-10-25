---
category: Components
type: Layout
title: Flex
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*SMzgSJZE_AwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8yArQ43EGccAAAAAAAAAAAAADrJ8AQ/original
tag: New
---

## When To Use

- Good for setting spacing between elements.
- Suitable for setting various horizontal and vertical alignments.

### Difference with Space component

- Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
- Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.

## API

> This component is available since `ant-design-vue@4.0.7`. The default behavior of Flex in horizontal mode is to align upward, In vertical mode, aligns the stretch, You can adjust this via properties.

| Property | Description | type | Default | Version |
| --- | --- | --- | --- | --- |
| vertical | Is direction of the flex vertical, use `flex-direction: column` | boolean | `false` |  |
| wrap | Set whether the element is displayed in a single line or in multiple lines | reference [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap) | nowrap |  |
| justify | Sets the alignment of elements in the direction of the main axis | reference [justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) | normal |  |
| align | Sets the alignment of elements in the direction of the cross axis | reference [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) | normal |  |
| flex | flex CSS shorthand properties | reference [flex](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) | normal |  |
| gap | Sets the gap between grids | `small` \| `middle` \| `large` \| string \| number | - |  |
| component | custom element type | Component | `div` |  |
