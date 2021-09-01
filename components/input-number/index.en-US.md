---
category: Components
type: Data Entry
title: InputNumber
cover: https://gw.alipayobjects.com/zos/alicdn/XOS8qZ0kU/InputNumber.svg
---

Enter a number within certain range with the mouse or keyboard.

## When To Use

When a numeric value needs to be provided.

## API

| property | description | type | default |
| --- | --- | --- | --- |
| autofocus | get focus when component mounted | boolean | false |
| defaultValue | initial value | number |  |
| disabled | disable the input | boolean | false |
| formatter | Specifies the format of the value presented | function(value: number \| string): string | - |
| max | max value | number | Infinity |
| min | min value | number | -Infinity |
| parser | Specifies the value extracted from formatter | function( string): number | - |
| precision | precision of input value | number | - |
| decimalSeparator | decimal separator | string | - |
| size | height of input box | string | - |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal. | number\|string | 1 |
| value(v-model) | current value | number |  |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- | --- |
| change | The callback triggered when the value is changed. | function(value: number \| string) |  |  |
| pressEnter | The callback function that is triggered when Enter key is pressed. | function(e) |  | 1.5.0 |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
