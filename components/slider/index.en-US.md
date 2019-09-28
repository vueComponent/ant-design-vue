## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autoFocus | get focus when component mounted | boolean | false |
| defaultValue | The default value of slider. When `range` is `false`, use `number`, otherwise, use `[number, number]` | number\|number\[] | 0 or \[0, 0] |
| disabled | If true, the slider will not be interactable. | boolean | false |
| dots | Whether the thumb can drag over tick only. | boolean | false |
| included | Make effect when `marks` not null，`true` means containment and `false` means coordinative | boolean | true |
| marks | Tick mark of Slider, type of key must be `number`, and must in closed interval \[min, max], each mark can declare its own style. | object | { number: string\|VNode } or { number: { style: object, label: string\|VNode } } or { number: () => VNode } |
| max | The maximum value the slider can slide to | number | 100 |
| min | The minimum value the slider can slide to. | number | 0 |
| range | dual thumb mode | boolean | false |
| step | The granularity the slider can step through values. Must greater than 0, and be divided by (max - min) . When `marks` no null, `step` can be `null`. | number\|null | 1 |
| tipFormatter | Slider will pass its value to `tipFormatter`, and display its value in Tooltip, and hide Tooltip when return value is null. | Function\|null | IDENTITY |
| value(v-model) | The value of slider. When `range` is `false`, use `number`, otherwise, use `[number, number]` | number\|number\[] |  |
| vertical | If true, the slider will be vertical. | Boolean | false |
| tooltipVisible | If true, Tooltip will show always, or it will not show anyway, even if dragging or hovering. | Boolean |  |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| afterChange | Fire when `mouseup` is fired. | Function(value) | NOOP |
| change | Callback function that is fired when the user changes the slider's value. | Function(value) | NOOP |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
