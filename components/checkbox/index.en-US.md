---
category: Components
type: Data Entry
title: Checkbox
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*DzgiRbW3khIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G3MjTYXL6AIAAAAAAAAAAAAADrJ8AQ/original
---

Checkbox component.

## When To Use

- Used for selecting multiple values from several options.
- If you use only one checkbox, it is the same as using Switch to toggle between two states. The difference is that Switch will trigger the state change directly, but Checkbox just marks the state as changed and this needs to be submitted.

## API

### Props

#### Checkbox

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autofocus | get focus when component mounted | boolean | false |  |
| checked(v-model) | Specifies whether the checkbox is selected. | boolean | false |  |
| disabled | Disable checkbox | boolean | false |  |
| indeterminate | indeterminate checked state of checkbox | boolean | false |  |
| value | value of checkbox in CheckboxGroup | boolean \| string \| number | - |  |

#### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes. | Function(e:Event) |  |

#### Checkbox Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Disable all checkboxes | boolean | false |  |
| name | The `name` property of all `input[type="checkbox"]` children | string | - | 1.5.0 |
| options | Specifies options, you can customize `label` with slot = "label" slot-scope="option" | string\[] \| Array&lt;{ label: string value: string disabled?: boolean, indeterminate?: boolean, onChange?: function }> | \[] |  |
| value(v-model) | Used for setting the currently selected value. | (boolean \| string \| number)\[] | \[] |  |

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
