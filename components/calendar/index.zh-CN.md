---
category: Components
type: 数据展示
title: Calendar
subtitle: 日历
cover: https://gw.alipayobjects.com/zos/antfincdn/dPQmLq08DI/Calendar.svg
---

按照日历形式展示数据的容器。

## 何时使用

当数据是日期或按照日期划分时，例如日程、课表、价格日历等，农历等。目前支持年/月切换。

## API

**注意：**Calendar 部分 locale 是从 value 中读取，所以请先正确设置 dayjs 的 locale。

```html
// 默认语言为 en-US，所以如果需要使用其他语言，推荐在入口文件全局设置 locale
// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// dayjs.locale('zh-cn');

<a-calendar v-model:value="value" @panelChange="onPanelChange" @select="onSelect"></a-calendar>
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dateCellRender | 作用域插槽，用来自定义渲染日期单元格，返回内容会被追加到单元格, | v-slot:dateCellRender="{current: dayjs}" | 无 |  |
| dateFullCellRender | 作用域插槽，自定义渲染日期单元格，返回内容覆盖单元格 | v-slot:dateFullCellRender="{current: dayjs}" | 无 |  |
| disabledDate | 不可选择的日期 | (currentDate: dayjs) => boolean | 无 |  |
| fullscreen | 是否全屏显示 | boolean | true |  |
| locale | 国际化配置 | object | [默认配置](https://github.com/vueComponent/ant-design-vue/blob/next/components/date-picker/locale/example.json) |  |
| mode | 初始模式，`month/year` | string | month |  |
| monthCellRender | 作用域插槽，自定义渲染月单元格，返回内容会被追加到单元格 | v-slot:monthCellRender="{current: dayjs}" | 无 |  |
| monthFullCellRender | 作用域插槽，自定义渲染月单元格，返回内容覆盖单元格 | v-slot:monthFullCellRender="{current: dayjs}" | 无 |  |
| validRange | 设置可以显示的日期 | \[[dayjs](https://day.js.org/), [dayjs](https://day.js.org/)] | 无 |  |
| value(v-model) | 展示日期 | [dayjs](https://day.js.org/) | 当前日期 |  |
| headerRender | 自定义头部内容 | v-slot:headerRender="{value: dayjs, type: string, onChange: f(), onTypeChange: f()}" | - |  |
| valueFormat | 可选，绑定值的格式，对 value、defaultValue 起作用。不指定则绑定值为 dayjs 对象 | string，[具体格式](https://day.js.org/docs/zh-CN/display/format) | - | |

### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- | --- |
| panelChange | 日期面板变化回调 | function(date: dayjs \| string, mode: string) | 无 |
| select | 点击选择日期回调 | function(date: dayjs \| string） | 无 |
| change | 日期变化时的回调, 面板变化有可能导致日期变化 | function(date: dayjs \| string） | 无 |
