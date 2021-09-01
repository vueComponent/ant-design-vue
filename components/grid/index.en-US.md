---
category: Components
type: Layout
cols: 1
title: Grid
cover: https://gw.alipayobjects.com/zos/alicdn/5rWLU27so/Grid.svg
---

24 Grids System.

## Design concept

In most business situations, Ant Design Vue needs to solve a lot of information storage problems within the design area, so based on 12 Grids System, we divided the design area into 24 sections.

We name the divided area 'box'. We suggest four boxes for horizontal arrangement at most, one at least. Boxes are proportional to the entire screen as shown in the picture above. To ensure a high level of visual comfort, we customize the typography inside of the box based on the box unit.

## Outline

In the grid system, we define the frame outside the information area based on \`row\` and \`column\`, to ensure that every area can have stable arrangement.

Following is a brief look at how it works:

- Establish a set of \`column\` in the horizontal space defined by \`row\` (abbreviated col)
- Your content elements should be placed directly in the \`col\`, and only \`col\` should be placed directly in \`row\`
- The column grid system is a value of 1-24 to represent its range spans. For example, three columns of equal width can be created by \`<a-col :span="8" />\`.
- If the sum of \`col\` spans in a \`row\` are more than 24, then the overflowing \`col\` as a whole will start a new line arrangement.

## Flex layout
Our grid systems support Flex layout to allow the elements within the parent to be aligned horizontally - left, center, right, wide arrangement, and decentralized arrangement. The Grid system also supports vertical alignment - top aligned, vertically centered, bottom-aligned. You can also define the order of elements by using \`order\`.
Flex layout uses a 24 grid layout to define the width of each "box", but does not rigidly adhere to the grid layout.

## API

### Row

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| align | the vertical alignment of the flex layout: `top` `middle` `bottom` | string | `top` |
| gutter | spacing between grids, could be a number or a object like `{ xs: 8, sm: 16, md: 24}`. or you can use array to make horizontal and vertical spacing work at the same time `[horizontal, vertical]` (supported after `1.5.0`) | number/object/array | 0 |
| justify | horizontal arrangement of the flex layout: `start` `end` `center` `space-around` `space-between` | string | `start` |
| wrap | Auto wrap line | boolean | false |

### Col

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| flex | the layout fill of flex | string\|number | - |
| offset | the number of cells to offset Col from the left | number | 0 |
| order | raster order, used in `flex` layout mode | number | 0 |
| pull | the number of cells that raster is moved to the left | number | 0 |
| push | the number of cells that raster is moved to the right | number | 0 |
| span | raster number of cells to occupy, 0 corresponds to `display: none` | number | none |
| xs | `<576px` and also default setting, could be a `span` value or an object containing above props | number\|object | - |
| sm | `≥576px`, could be a `span` value or an object containing above props | number\|object | - |
| md | `≥768px`, could be a `span` value or an object containing above props | number\|object | - |
| lg | `≥992px`, could be a `span` value or an object containing above props | number\|object | - |
| xl | `≥1200px`, could be a `span` value or an object containing above props | number\|object | - |
| xxl | `≥1600px`, could be a `span` value or an object containing above props | number\|object | - |

The breakpoints of responsive grid follow [BootStrap 4 media queries rules](https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints)(not including `occasionally part`).

## FAQ

### How to support IE9 when using responsive?

You can use [matchMedia polyfill](https://github.com/paulirish/matchMedia.js/) to handle this.
