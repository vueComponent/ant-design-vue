---
category: Components
type: Data Display
title: Statistic
cover: https://gw.alipayobjects.com/zos/antfincdn/rcBNhLBrKbE/Statistic.svg
---

Display statistic number.

## When To Use

- When want to highlight some data.
- When want to display statistic data with description.

## API

### Statistic

| Property         | Description                   | Type                        | Default |
| ---------------- | ----------------------------- | --------------------------- | ------- |
| decimalSeparator | decimal separator             | string                      | .       |
| formatter        | customize value display logic | v-slot \|({value}) => VNode | -       |
| groupSeparator   | group separator               | string                      | ,       |
| precision        | precision of input value      | number                      | -       |
| prefix           | prefix node of value          | string \| v-slot            | -       |
| suffix           | suffix node of value          | string \| v-slot            | -       |
| title            | Display title                 | string \| v-slot            | -       |
| value            | Display value                 | string \| number            | -       |
| valueStyle       | Set value css style           | style                       | -       |

### Statistic.Countdown

| Property   | Description                              | Type             | Default    |
| ---------- | ---------------------------------------- | ---------------- | ---------- |
| format     | Format as [dayjs](https://day.js.org/) | string           | 'HH:mm:ss' |
| prefix     | prefix node of value                     | string \| v-slot | -          |
| suffix     | suffix node of value                     | string \| v-slot | -          |
| title      | Display title                            | string \| v-slot | -          |
| value      | Set target countdown time                | number \| dayjs | -          |
| valueStyle | Set value css style                      | style            | -          |

#### Statistic.Countdown Events

| Events Name | Description            | Arguments  |
| ----------- | ---------------------- | ---------- | --- |
| finish      | Trigger when time's up | () => void | -   |
