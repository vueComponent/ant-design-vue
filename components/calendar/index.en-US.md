---
category: Components
type: Data Display
title: Calendar
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*nF6_To7pDSAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-p-wQLik200AAAAAAAAAAAAADrJ8AQ/original
---

Container for displaying data in calendar form.

## When To Use

When data is in the form of dates, such as schedules, timetables, prices calendar, lunar calendar. This component also supports Year/Month switch.

## API

**Note:** Part of the Calendar's locale is read from `value`. So, please set the locale of `dayjs` correctly.

```html
// The default locale is en-US, if you want to use other locale, just set locale in entry file
globally. // import dayjs from 'dayjs'; // import 'dayjs/locale/zh-cn'; // dayjs.locale('zh-cn');

<a-calendar v-model:value @panelChange="onPanelChange" @select="onSelect"></a-calendar>
```

customize the progress dot by setting a scoped slot

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dateCellRender | Customize the display of the date cell by setting a scoped slot, the returned content will be appended to the cell | v-slot:dateCellRender="{current: dayjs}" | - |  |
| dateFullCellRender | Customize the display of the date cell by setting a scoped slot, the returned content will override the cell | v-slot:dateFullCellRender="{current: dayjs}" | - |  |
| disabledDate | Function that specifies the dates that cannot be selected | (currentDate: dayjs) => boolean | - |  |
| fullscreen | Whether to display in full-screen | boolean | `true` |  |
| headerRender | render custom header in panel | v-slot:headerRender="{value: dayjs, type: string, onChange: f(), onTypeChange: f()}" | - | 1.5.0 |
| locale | The calendar's locale | object | [default](https://github.com/vueComponent/ant-design-vue/blob/main/components/date-picker/locale/example.json) |  |
| mode | The display mode of the calendar | `month` \| `year` | `month` |  |
| monthCellRender | Customize the display of the month cell by setting a scoped slot, the returned content will be appended to the cell | v-slot:monthCellRender="{current: dayjs}" | - |  |
| monthFullCellRender | Customize the display of the month cell by setting a scoped slot, the returned content will override the cell | v-slot:monthFullCellRender="{current: dayjs}" | - |  |
| validRange | to set valid range | \[[dayjs](https://day.js.org/), [dayjs](https://day.js.org/)] | - |  |
| value(v-model) | The current selected date | [dayjs](https://day.js.org/) | current date |  |
| valueFormat | optional, format of binding value. If not specified, the binding value will be a Date object | string, [date formats](https://day.js.org/docs/en/display/format) | - |  |

### events

| Events Name | Description | Arguments | Version |  |
| --- | --- | --- | --- | --- |
| change | Callback for when value change | function(date: dayjs \| string） | - |  |
| panelChange | Callback for when panel changes | function(date: dayjs \| string, mode: string) | - |  |
| select | Callback for when a date is selected, include source info | function(date: dayjs \| string,info:{ source: 'year' \| 'month' \| 'date' \| 'customize' }) | - |  |

### How to get date from panel click?

`select` event provide `info.source` to help on this:

```html
<script lang="ts" setup>
  const onSelect = (date, { source }) => {
    if (source === 'date') {
      console.log('Panel Select:', source);
    }
  };
</script>
<template>
  <a-calendar @select="onSelect" />
</template>
```
