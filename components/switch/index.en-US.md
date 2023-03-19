---
category: Components
type: Data Entry
title: Switch
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rtArRpBNDZcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*al07RK8SGf4AAAAAAAAAAAAADrJ8AQ/original
---

Switching Selector.

## When To Use

- If you need to represent the switching between two states or on-off state.
- The difference between `Switch` and `Checkbox` is that `Switch` will trigger a state change directly when you toggle it, while `Checkbox` is generally used for state marking, which should work in conjunction with submit operation.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autofocus | get focus when component mounted | boolean | false |  |
| checked(v-model) | determine whether the `Switch` is checked | checkedValue \| unCheckedValue | false |  |
| checkedChildren | content to be shown when the state is checked | string\|slot |  |  |
| checkedValue | value for checked state | boolean \| string \| number | true | 2.2.1 |
| disabled | Disable switch | boolean | false |  |
| loading | loading state of switch | boolean | false |  |
| size | the size of the `Switch`, options: `default` `small` | string | default |  |
| unCheckedChildren | content to be shown when the state is unchecked | string\|slot |  |  |
| unCheckedValue | value for unchecked state | boolean \| string \| number | false | 2.2.1 |

### Events

| Events Name | Description | Arguments |  |
| --- | --- | --- | --- |
| change | trigger when the checked state is changing | Function(checked: boolean \| string \| number, event: Event) |  |
| click | trigger when clicked | Function(checked: boolean \| string \| number, event: Event) |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
