---
category: Components
type: 数据录入
title: DatePicker
subtitle: 日期选择框
cover: https://gw.alipayobjects.com/zos/alicdn/RT_USzA48/DatePicker.svg
---

输入或选择日期的控件。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## API

日期类组件包括以下五种形式。

- DatePicker
- DatePicker\[picker="month"]
- DatePicker\[picker="week"]
- DatePicker\[picker="year"]
- DatePicker\[picker="quarter"]
- RangePicker

### 国际化配置

默认配置为 en-US，如果你需要设置其他语言，推荐在入口处使用我们提供的国际化组件，详见：[ConfigProvider 国际化](/components/config-provider-cn/)。

如有特殊需求（仅修改单一组件的语言），请使用 locale 参数，参考：[默认配置](https://github.com/vueComponent/ant-design-vue/blob/next/components/date-picker/locale/example.json)。

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
  // 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
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

### 共同的 API

以下 API 为 DatePicker、 RangePicker 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否显示清除按钮 | boolean | true |  |
| autofocus | 自动获取焦点 | boolean | false |  |
| bordered | 是否有边框 | boolean | true |  |
| dateRender | 自定义日期单元格的内容 | v-slot:dateRender="{current, today}" | - |  |
| disabled | 禁用 | boolean | false |  |
| disabledDate | 不可选择的日期 | (currentDate: dayjs) => boolean | - |  |
| dropdownClassName | 额外的弹出日历 className | string | - |  |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | function(trigger) | - |  |
| inputReadOnly | 设置输入框为只读（避免在移动设备上打开虚拟键盘） | boolean | false |  |
| locale | 国际化配置 | object | [默认配置](https://github.com/vueComponent/ant-design-vue/blob/next/components/date-picker/locale/example.json) | - |
| mode | 日期面板的状态 | `time` \| `date` \| `month` \| `year` \| `decade` | - |  |
| open | 控制弹层是否展开 | boolean | - |  |
| picker | 设置选择器类型 | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` | `quarter` |
| placeholder | 输入框提示文字 | string \| \[string, string] | - |  |
| popupStyle | 额外的弹出日历样式 | CSSProperties | {} |  |
| size | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px | `large` \| `middle` \| `small` | - |  |
| suffixIcon | 自定义的选择框后缀图标 | v-slot:suffixIcon | - |  |
| valueFormat | 可选，绑定值的格式，对 value、defaultValue、defaultPickerValue 起作用。不指定则绑定值为 dayjs 对象 | string，[具体格式](https://day.js.org/docs/zh-CN/display/format) | - |  |

### 共有的事件

| 事件名称    | 说明                     | 回调参数              |
| ----------- | ------------------------ | --------------------- | --- |
| openChange  | 弹出日历和关闭日历的回调 | function(status)      |
| panelChange | 日期面板变化时的回调     | function(value, mode) | -   |

### 共同的方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### DatePicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultPickerValue | 默认面板日期 | [dayjs](https://day.js.org/)] | - |  |
| disabledTime | 不可选择的时间 | function(date) | - |  |
| format | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [dayjs](https://day.js.org/docs/zh-CN/display/format)，支持[自定义格式](#components-date-picker-demo-format) | string \| (value: dayjs) => string \| (string \| (value: dayjs) => string)\[] | `YYYY-MM-DD` |  |
| renderExtraFooter | 在面板中添加额外的页脚 | v-slot:renderExtraFooter="mode" | - |  |
| showNow | 当设定了 `showTime` 的时候，面板是否显示“此刻”按钮 | boolean | - |  |
| showTime | 增加时间选择功能 | Object \| boolean | [TimePicker Options](/components/time-picker/#API) |  |
| showTime.defaultValue | 设置用户选择日期时默认的时分秒，[例子](#components-date-picker-demo-disabled-date) | [dayjs](https://day.js.org/)] | dayjs() |  |
| showToday | 是否展示“今天”按钮 | boolean | true |  |
| value(v-model) | 日期 | [dayjs](https://day.js.org/)] | - |  |

### DatePicker 事件

| 事件名称 | 说明               | 回调参数                                            |
| -------- | ------------------ | --------------------------------------------------- |
| change   | 时间发生变化的回调 | function(date: dayjs \| string, dateString: string) |
| ok       | 点击确定按钮的回调 | function(date: dayjs \| string)                     |

### DatePicker\[picker=year]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| format | 展示的日期格式，配置参考 [dayjs](https://day.js.org/docs/zh-CN/display/format) | string | `YYYY` |  |

### DatePicker\[picker=quarter]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| format | 展示的日期格式，配置参考 [dayjs](https://day.js.org/docs/zh-CN/display/format) | string | `YYYY-\QQ` |  |

### DatePicker\[picker=month]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| format | 展示的日期格式，配置参考 [dayjs](https://day.js.org/docs/zh-CN/display/format) | string | `YYYY-MM` |  |
| monthCellRender | 自定义的月份内容渲染方法 | v-slot:monthCellRender="{current, locale}" | - |  |

### DatePicker\[picker=week]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| format | 展示的日期格式，配置参考 [dayjs](https://day.js.org/docs/zh-CN/display/format) | string | `YYYY-wo` |  |

### RangePicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowEmpty | 允许起始项部分为空 | \[boolean, boolean] | \[false, false] |  |
| dateRender | 自定义日期单元格的内容。 | v-slot:dateRender="{current: dayjs, today: dayjs, info: { range: `start` \| `end` }}" | - |  |
| defaultPickerValue | 默认面板日期 | [dayjs](https://day.js.org/)\[] | - |  |
| disabled | 禁用起始项 | \[boolean, boolean] | - |  |
| disabledTime | 不可选择的时间 | function(date: dayjs, partial: `start` \| `end`) | - |  |
| format | 展示的日期格式 | string | `YYYY-MM-DD HH:mm:ss` |  |
| ranges | 预设时间范围快捷选择 | { \[range: string]: [dayjs](https://day.js.org/)\[] } \| { \[range: string]: () => [dayjs](https://day.js.org/)\[] } | - |  |
| renderExtraFooter | 在面板中添加额外的页脚 | () => React.ReactNode | - |  |
| separator | 设置分隔符 | string \| v-slot:separator | `<SwapRightOutlined />` |  |
| showTime | 增加时间选择功能 | Object\|boolean | [TimePicker Options](/components/time-picker/#API) |  |
| showTime.defaultValue | 设置用户选择日期时默认的时分秒，[例子](#components-date-picker-demo-disabled-date) | [dayjs](https://day.js.org/)\[] | \[dayjs(), dayjs()] |  |
| value(v-model) | 日期 | [dayjs](https://day.js.org/)\[] | - |  |

### RangePicker 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| calendarChange | 待选日期发生变化的回调 | function(dates: \[dayjs, dayjs\] \| \[string, string\], dateStrings: \[string, string\], info: { range:`start`\|`end` }) |
| change | 日期范围发生变化的回调 | function(dates: \[dayjs, dayjs\] \| \[string, string\], dateStrings: \[string, string\]) |
| ok | 点击确定按钮的回调 | function(dates: \[dayjs, dayjs\] \| \[string, string\]) |

## FAQ

### 如何在 DatePicker 中使用自定义日期库（如 moment.js \| dayjs \| date-fns）？

请参考[《自定义日期库》](/docs/vue/replace-date-cn)

### 为何全局修改 dayjs.locale 不生效？

DatePicker 默认 `locale` 为 `en`。你可以通过 DatePicker 的 `locale` 属性来单独设置，也可以通过 [ConfigProvider `locale`](/components/config-provider-cn) 属性来配置。
