## API

Properties that shared by all types.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | to set the type, options: `line` `circle` `dashboard` | string | `line` |
| format | template function of the content | function(percent, successPercent) \| v-slot:format="percent, successPercent" | `percent => percent + '%'` |
| percent | to set the completion percentage | number | 0 |
| showInfo | whether to display the progress value and the status icon | boolean | true |
| status | to set the status of the Progress, options: `success` `exception` `active` `normal` | string | - |
| strokeLinecap | to set the style of the progress linecap | Enum{ 'round', 'square' } | `round` |
| strokeColor | color of progress bar | string | - |
| successPercent | segmented success percent | number | 0 |

### `type="line"`

| Property    | Description                                      | Type   | Default |
| ----------- | ------------------------------------------------ | ------ | ------- |
| strokeWidth | to set the width of the progress bar, unit: `px` | number | 10      |

### `type="circle"`

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| width | to set the canvas width of the circular progress, unit: `px` | number | 132 |
| strokeWidth | to set the width of the circular progress, unit: percentage of the canvas width | number | 6 |

### `type="dashboard"`

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| width | to set the canvas width of the dashboard progress, unit: `px` | number | 132 |
| strokeWidth | to set the width of the dashboard progress, unit: percentage of the canvas width | number | 6 |
| gapDegree | the gap degree of half circle, 0 ~ 360 | number | 0 |
| gapPosition | the gap position, options: `top` `bottom` `left` `right` | string | `top` |
