---
category: Components
type: Feedback
title: Progress
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gK_4S6fDRfgAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HJH8Tb1lcYAAAAAAAAAAAAAADrJ8AQ/original
---

Display the current progress of an operation flow.

## When To Use

If it will take a long time to complete an operation, you can use `Progress` to show the current progress and status.

- When an operation will interrupt the current interface, or it needs to run in the background for more than 2 seconds.
- When you need to display the completion percentage of an operation.

## API

Properties that shared by all types.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | The template function of the content | function(percent, successPercent) | (percent) => percent + `%` |  |
| percent | To set the completion percentage | number | 0 |  |
| showInfo | Whether to display the progress value and the status icon | boolean | true |  |
| status | To set the status of the Progress, options: `success` `exception` `normal` `active`(line only) | string | - |  |
| strokeColor | The color of progress bar | string | - |  |
| strokeLinecap | To set the style of the progress linecap | `round` \| `butt` \| `square`, see [stroke-linecap](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) | `round` | - |
| success | Configs of successfully progress bar | { percent: number, strokeColor: string } | - |  |
| title | html dom title | string | - | 3.0 |
| trailColor | The color of unfilled part | string | - |  |
| type | To set the type, options: `line` `circle` `dashboard` | string | `line` |  |
| size | Progress size | number \| \[number, number] \| "small" \| "default" | "default" |  |

### `type="line"`

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count | number | - | - |
| strokeColor | The color of progress bar, render `linear-gradient` when passing an object, could accept `string[]` when has `steps`. | string \| string[] \| { from: string; to: string; direction: string } | - | - |

### `type="circle"`

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| strokeColor | The color of circular progress, render `linear-gradient` when passing an object | string \| object | - | - |
| strokeWidth | To set the width of the circular progress, unit: percentage of the canvas width | number | 6 | - |

### `type="dashboard"`

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| gapDegree | The gap degree of half circle, 0 ~ 295 | number | 75 |
| gapPosition | The gap position, options: `top` `bottom` `left` `right` | string | `bottom` |
| strokeWidth | To set the width of the dashboard progress, unit: percentage of the canvas width | number | 6 |
