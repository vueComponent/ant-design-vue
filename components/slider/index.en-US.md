---
category: Components
type: Data Entry
title: Slider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_4heQaUrFn4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XkgXTaudeosAAAAAAAAAAAAADrJ8AQ/original
---

A Slider component for displaying current value and intervals in range.

## When To Use

To input a value in a range.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autofocus | get focus when component mounted | boolean | false |  |
| disabled | If true, the slider will not be intractable. | boolean | false |  |
| dots | Whether the thumb can drag over tick only. | boolean | false |  |
| handleStyle | The style of slider handle | CSSProperties | - |  |
| included | Make effect when `marks` not null, `true` means containment and `false` means coordinative | boolean | true |  |
| mark | Custom tick mark of Slider, | v-slot:mark | { point: number, label: any } | 3.0 |
| marks | Tick mark of Slider, type of key must be `number`, and must in closed interval \[min, max], each mark can declare its own style. | object | { number: string\|VNode } or { number: { style: object, label: string\|VNode } } or { number: () => VNode } |  |
| max | The maximum value the slider can slide to | number | 100 |  |
| min | The minimum value the slider can slide to. | number | 0 |  |
| range | dual thumb mode | boolean | false |  |
| reverse | reverse the component | boolean | false | 1.5.0 |
| step | The granularity the slider can step through values. Must greater than 0, and be divided by (max - min) . When `marks` no null, `step` can be `null`. | number\|null | 1 |  |
| trackStyle | The style of slider track | CSSProperties | - |  |
| value(v-model) | The value of slider. When `range` is `false`, use `number`, otherwise, use `[number, number]` | number\|number\[] |  |  |
| vertical | If true, the slider will be vertical. | Boolean | false |  |
| tipFormatter | Slider will pass its value to `tipFormatter`, and display its value in Tooltip, and hide Tooltip when return value is null. | Function\|null | IDENTITY |  |
| tooltipPlacement | Set Tooltip display position. Ref [`Tooltip`](/components/tooltip/). | string |  | 1.5.0 |
| tooltipOpen | If true, Tooltip will show always, or it will not show anyway, even if dragging or hovering. | Boolean |  | 4.0 |
| getTooltipPopupContainer | The DOM container of the Tooltip, the default behavior is to create a div element in body. | Function | () => document.body | 1.5.0 |

### events

| Events Name | Description | Arguments |  |
| --- | --- | --- | --- |
| change | Callback function that is fired when the user changes the slider's value. | Function(value) | NOOP |
| afterChange | Fire when `mouseup` is fired. | Function(value) | NOOP |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
