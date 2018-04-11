

## API

### Radio

| Property | Description | Type | optional | Default |
| -------- | ----------- | ---- | -------- | ------- |
| autoFocus | get focus when component mounted | boolean | false |  |
| checked | Specifies whether the radio is selected. | boolean |  | false |
| defaultChecked | Specifies the initial state: whether or not the radio is selected. | boolean |  | false |
| disabled | Disable radio | boolean |  | false |
| value | According to value for comparison, to determine whether the selected | any |  | none |

### RadioGroup

radio group，wrap a group of `Radio`。

| Property | Description | Type | optional | Default |
| -------- | ----------- | ---- | -------- | ------- |
| defaultValue | Default selected value | any | none | none |
| disabled | Disable all radio buttons | boolean |  | false |
| name | The `name` property of all `input[type="radio"]` children | string |  | none |
| options | set children optional | string\[] \| Array&lt;{ label: string value: string disabled?: boolean }> | 无 | 无 |
| size | Size, only on radio style | string | `large` `default` `small` | `default` |
| value(v-model) | Used for setting the currently selected value. | any | none | none |


### RadioGroup Events
| Events Name | Description | Arguments |
| --- | --- | --- |
| change | The callback function that is triggered when the state changes. | Function(e:Event) |

## Methods

### Radio

| Name | Description |
| ---- | ----------- |
| blur() | remove focus |
| focus() | get focus |
