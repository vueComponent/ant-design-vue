## API

### Radio

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autoFocus | get focus when component mounted | boolean | false |
| checked | Specifies whether the radio is selected. | boolean | - |
| defaultChecked | Specifies the initial state: whether or not the radio is selected. | boolean |  | false |
| disabled | Disable radio | boolean | false |
| value | According to value for comparison, to determine whether the selected | any | - |

### RadioGroup

Radio group can wrap a group of `Radio`。

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| defaultValue | Default selected value | any | - |
| disabled | Disable all radio buttons | boolean | false |
| name | The `name` property of all `input[type="radio"]` children | string | - |
| options | set children optional | string\[] \| Array&lt;{ label: string value: string disabled?: boolean }> | - |
| size | size for radio button style | `large` \| `default` \| `small` | `default` |
| value(v-model) | Used for setting the currently selected value. | any | - |
| buttonStyle | style type of radio button | `outline` \| `solid` | `outline` |

### RadioGroup Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | The callback function that is triggered when the state changes. | Function(e:Event) |

## Methods

### Radio

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
