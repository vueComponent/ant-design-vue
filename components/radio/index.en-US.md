---
category: Components
type: Data Entry
title: Radio
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M-YKTJnWM2kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a9roS6DHFIcAAAAAAAAAAAAADrJ8AQ/original
---

Radio.

## When To Use

- Used to select a single state from multiple options.
- The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.

## API

### Radio/Radio.Button

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autofocus | get focus when component mounted | boolean | false |
| checked(v-model) | Specifies whether the radio is selected. | boolean | - |
| disabled | Disable radio | boolean | false |
| value | According to value for comparison, to determine whether the selected | any | - |

### RadioGroup

Radio group can wrap a group of `Radio`。

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| buttonStyle | style type of radio button | `outline` \| `solid` | `outline` |  |
| disabled | Disable all radio buttons | boolean | false |  |
| name | The `name` property of all `input[type="radio"]` children | string | - |  |
| options | set children optional | string\[] \| number\[] \| Array&lt;{ label: string value: string disabled?: boolean }> | - |  |
| optionType | Set Radio optionType | `default` \| `button` | `default` | 3.0.0 |
| size | size for radio button style | `large` \| `default` \| `small` | `default` |  |
| value(v-model) | Used for setting the currently selected value. | any | - |  |

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
