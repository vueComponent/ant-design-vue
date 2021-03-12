## API

### Props

#### Checkbox

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoFocus | get focus when component mounted | boolean | false |  |
| checked | Specifies whether the checkbox is selected. | boolean | false |  |
| defaultChecked | Specifies the initial state: whether or not the checkbox is selected. | boolean | false |  |
| disabled | Disable checkbox | boolean | false |  |
| indeterminate | indeterminate checked state of checkbox | boolean | false |  |

#### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes. | Function(e:Event) |  |

#### Checkbox Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | Default selected value | string\[] | \[] |  |
| disabled | Disable all checkboxes | boolean | false |  |
| name | The `name` property of all `input[type="checkbox"]` children | string | - | 1.5.0 |
| options | Specifies options, you can customize `label` with slot = "label" slot-scope="option" | string\[] \| Array&lt;{ label: string value: string disabled?: boolean, indeterminate?: boolean, onChange?: function }> | \[] |  |
| value | Used for setting the currently selected value. | string\[] | \[] |  |

#### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes. | Function(checkedValue) |  |

### Methods

#### Checkbox

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | remove focus |         |
| focus() | get focus    |         |
