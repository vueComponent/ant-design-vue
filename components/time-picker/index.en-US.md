---
category: Components
type: Data Entry
title: TimePicker
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*kGmGSLk_1fwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1hDmQJIDFJQAAAAAAAAAAAAADrJ8AQ/original
---

To select/input a time.

## When To Use

By clicking the input box, you can select a time from a popup panel.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether allow clearing text | boolean | true |  |
| autofocus | If get focus when component mounted | boolean | false |  |
| bordered | Whether has border style | boolean | true |  |
| clearIcon | The custom clear icon | v-slot:clearIcon | - |  |
| clearText | The clear tooltip of icon | string | clear |  |
| disabled | Determine whether the TimePicker is disabled | boolean | false |  |
| disabledTime | To specify the time that cannot be selected | [DisabledTime](#disabledtime) | - | 3.3.0 |
| format | To set the time format | string | `HH:mm:ss` |  |
| getPopupContainer | To set the container of the floating layer, while the default is to create a div element in body | function(trigger) | - |  |
| hideDisabledOptions | Whether hide the options that can not be selected | boolean | false |  |
| hourStep | Interval between hours in picker | number | 1 |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |
| minuteStep | Interval between minutes in picker | number | 1 |  |
| open(v-model) | Whether to popup panel | boolean | false |  |
| placeholder | Display when there's no value | string \| \[string, string] | `Select a time` |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| popupClassName | The className of panel | string | - |  |
| popupStyle | The style of panel | CSSProperties | - |  |
| renderExtraFooter | Called from time picker panel to render some addon to its bottom | v-slot:renderExtraFooter | - |  |
| secondStep | Interval between seconds in picker | number | 1 |  |
| showNow | Whether to show `Now` button on panel | boolean | - |  |
| suffixIcon | The custom suffix icon | v-slot:suffixIcon | - |  |
| use12Hours | Display as 12 hours format, with default format `h:mm:ss a` | boolean | false |  |
| value(v-model) | To set time | [dayjs](https://day.js.org/) | - |  |
| valueFormat | optional, format of binding value. If not specified, the binding value will be a Date object | string, [date formats](https://day.js.org/docs/en/display/format) | - |  |

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | a callback function, can be executed when the selected time is changing | function(time: dayjs \| string, timeString: string): void |
| openChange | a callback function which will be called while panel opening/closing | (open: boolean): void |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

### TimeRangePicker

Same props from [RangePicker](/components/date-picker/#rangepicker) of DatePicker. And includes additional props:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| order | Order start and end time | boolean | true |  |
| disabledTime | To specify the time that cannot be selected | [RangeDisabledTime](#rangedisabledtime) | - | 3.3.0 |

#### RangeDisabledTime

```typescript
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

## FAQ

### How to use DatePicker with customize date library（like moment.js \| dayjs \| date-fns）？

Please refer [replace date](/docs/vue/replace-date)
