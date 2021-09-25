---
category: Components
type: Data Entry
title: DatePicker
cover: https://gw.alipayobjects.com/zos/alicdn/RT_USzA48/DatePicker.svg
---

To select or input a date.

## When To Use

By clicking the input box, you can select a date from a popup calendar.

## API

There are five kinds of picker:

- DatePicker
- DatePicker\[picker="month"]
- DatePicker\[picker="week"]
- DatePicker\[picker="year"]
- DatePicker\[picker="quarter"]
- RangePicker

### Localization

The default locale is en-US, if you need to use other languages, recommend to use internationalized components provided by us at the entrance. Look at: [ConfigProvider](/components/config-provider/).

If there are special needs (only modifying single component language), Please use the property: local. Example: [default](https://github.com/vueComponent/ant-design-vue/blob/next/components/date-picker/locale/example.json).

```html
<template>
  <a-date-picker v-model:value="value" :locale="locale" />
</template>
<script>
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import { defineComponent } from 'vue';
  export default defineComponent({
    setup() {
      return {
        locale,
        value: null,
      };
    },
  });
</script>
```

```html
<template>
  <a-config-provider :locale="locale">
    <a-date-picker v-model:value="value" />
  </a-config-provider>
</template>
<script>
  // The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import { defineComponent } from 'vue';
  dayjs.locale('zh-cn');
  export default defineComponent({
    setup() {
      return {
        value: dayjs('2015-01-01', 'YYYY-MM-DD')
        dayjs,
        locale
      };
    },
  });
</script>
```

### Common API

The following APIs are shared by DatePicker, RangePicker.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether to show clear button | boolean | true |  |
| autofocus | If get focus when component mounted | boolean | false |  |
| bordered | Whether has border style | boolean | true |  |
| dateRender | Custom rendering function for date cells | v-slot:dateRender="{current, today}" | - |  |
| disabled | Determine whether the DatePicker is disabled | boolean | false |  |
| disabledDate | Specify the date that cannot be selected | (currentDate: dayjs) => boolean | - |  |
| dropdownClassName | To customize the className of the popup calendar | string | - |  |
| getPopupContainer | To set the container of the floating layer, while the default is to create a `div` element in `body` | function(trigger) | - |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |
| locale | Localization configuration | object | [default](https://github.com/vueComponent/ant-design-vue/blob/next/components/date-picker/locale/example.json) |  |
| mode | The picker panel mode | `time` \| `date` \| `month` \| `year` \| `decade` | - |  |
| open | The open state of picker | boolean | - |  |
| picker | Set picker type | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` | `quarter` |
| placeholder | The placeholder of date input | string \| \[string,string] | - |  |
| popupStyle | To customize the style of the popup calendar | CSSProperties | {} |  |
| size | To determine the size of the input box, the height of `large` and `small`, are 40px and 24px respectively, while default size is 32px | `large` \| `middle` \| `small` | - |  |
| suffixIcon | The custom suffix icon | v-slot:suffixIcon | - |  |
| valueFormat | optional, format of binding value. If not specified, the binding value will be a Date object | string，[date formats](https://day.js.org/docs/en/display/format) | - |  |

### Common Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| openChange | a callback function, can be executed whether the popup calendar is popped up or closed | function(status) |  |
| panelChange | callback when picker panel mode is changed | function(value, mode) |  |

### Common Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | remove focus |         |
| focus() | get focus    |         |

### DatePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultPickerValue | To set default picker date | [dayjs](https://day.js.org/) | - |  |
| disabledTime | To specify the time that cannot be selected | function(date) | - |  |
| format | To set the date format, refer to [dayjs](https://day.js.org/). When an array is provided, all values are used for parsing and first value is used for formatting, support [Custom Format](#components-date-picker-demo-format) | string \| (value: dayjs) => string \| (string \| (value: dayjs) => string)\[] | `YYYY-MM-DD` |  |
| renderExtraFooter | Render extra footer in panel | v-slot:renderExtraFooter="mode" | - |  |
| showNow | Whether to show 'Now' button on panel when `showTime` is set | boolean | - |  |
| showTime | To provide an additional time selection | object \| boolean | [TimePicker Options](/components/time-picker/#API) |  |
| showTime.defaultValue | To set default time of selected date, [demo](#components-date-picker-demo-disabled-date) | [dayjs](https://day.js.org/) | dayjs() |  |
| showToday | Whether to show `Today` button | boolean | true |  |
| value(v-model) | To set date | [dayjs](https://day.js.org/) | - |  |

### DatePicker Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | a callback function, can be executed when the selected time is changing | function(date: dayjs \| string, dateString: string) |  |
| ok | callback when click ok button | function(date: dayjs \| string) |  |

### DatePicker\[picker=year]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | To set the date format, refer to [dayjs](https://day.js.org/) | string | `YYYY` |  |

### DatePicker\[picker=quarter]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | To set the date format, refer to [dayjs](https://day.js.org/) | string | `YYYY-\QQ` |  |

### DatePicker\[picker=month]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | To set the date format, refer to [dayjs](https://day.js.org/) | string | `YYYY-MM` |  |
| monthCellRender | Custom month cell content render method | v-slot:monthCellRender="{current, locale}" | - |  |

### DatePicker\[picker=week]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | To set the date format, refer to [dayjs](https://day.js.org/) | string | `YYYY-wo` |  |

### RangePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowEmpty | Allow start or end input leave empty | \[boolean, boolean] | \[false, false] |  |
| dateRender | Customize date cell. | v-slot:dateRender="{current: dayjs, today: dayjs, info: { range: `start` \| `end` }}" | - |  |
| defaultPickerValue | To set default picker date | \[[dayjs](https://day.js.org/), [dayjs](https://day.js.org/)] | - |  |
| disabled | If disable start or end | \[boolean, boolean] | - |  |
| disabledTime | To specify the time that cannot be selected | function(date: dayjs, partial: `start` \| `end`) | - |  |
| format | To set the date format, refer to [dayjs](https://day.js.org/). When an array is provided, all values are used for parsing and first value is used for formatting | string \| string\[] | `YYYY-MM-DD HH:mm:ss` |  |
| ranges | The preseted ranges for quick selection | { \[range: string]: [dayjs](https://day.js.org/)\[] } \| { \[range: string]: () => [dayjs](https://day.js.org/)\[] } | - |  |
| renderExtraFooter | Render extra footer in panel | v-slot:renderExtraFooter | - |  |
| separator | Set separator between inputs | string \| v-slot:separator | `<SwapRightOutlined />` |  |
| showTime | To provide an additional time selection | object \| boolean | [TimePicker Options](/components/time-picker/#API) |  |
| showTime.defaultValue | To set default time of selected date, [demo](#components-date-picker-demo-disabled-date) | [dayjs](https://day.js.org/)\[] | \[dayjs(), dayjs()] |  |
| value(v-model) | To set date | \[[dayjs](https://day.js.org/), [dayjs](https://day.js.org/)] | - |  |

### RangePicker Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- | --- |
| calendarChange | Callback function, can be executed when the start time or the end time of the range is changing. | function(dates: \[dayjs, dayjs], dateStrings: \[string, string], info: { range:`start`\|`end` }) | - |  |
| change | a callback function, can be executed when the selected time is changing | function(dates: \[dayjs, dayjs\] \| \[string, string\], dateStrings: \[string, string\]) |  |
| ok | callback when click ok button | function(dates: \[dayjs, dayjs\] \| \[string, string\]) |  |

## FAQ

### How to use DatePicker with customize date library（like moment.js \| dayjs \| date-fns）？

Please refer [replace date](/docs/vue/replace-date)

### Why config dayjs.locale globally not work?

DatePicker default set `locale` as `en` in v4. You can config DatePicker `locale` prop or [ConfigProvider `locale`](/components/config-provider) prop instead.
