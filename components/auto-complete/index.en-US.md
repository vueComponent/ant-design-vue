---
category: Components
type: Data Entry
cols: 2
title: AutoComplete
cover: https://gw.alipayobjects.com/zos/alicdn/qtJm4yt45/AutoComplete.svg
---

Autocomplete function of input field.

## When To Use

When there is a need for autocomplete functionality.

## API

```html
<a-auto-complete v-model:value="value" :options="options" />
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button, effective in multiple mode only. | boolean | false |  |
| autofocus | get focus when component mounted | boolean | false |  |
| backfill | backfill selected item the input when using keyboard | boolean | false |  |
| #default (for customize input element) | customize input element | HTMLInputElement / HTMLTextAreaElement | `<Input />` |  |
| options | Data source for autocomplete | [DataSourceItemType](https://github.com/vueComponent/ant-design-vue/blob/724d53b907e577cf5880c1e6742d4c3f924f8f49/components/auto-complete/index.vue#L9)\[] |  |  |
| option | custom render option by slot | v-slot:option="{value, label, [disabled, key, title]}" | - | 3.0 |
| dropdownMenuStyle | additional style applied to dropdown menu | object |  | 1.5.0 |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| disabled | Whether disabled select | boolean | false |  |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true |  |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | boolean or function(inputValue, option) | true |  |
| optionLabelProp | Which prop value of option will render as content of select. | string | `children` |  |
| placeholder | placeholder of input | string | - |  |
| v-model:value | selected option | string\|string\[]\|{ key: string, label: string\|vNodes }\|Array&lt;{ key: string, label: string\|vNodes }> | - |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| open | Controlled open state of dropdown | boolean | - |  |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- | --- |
| change | Called when select an option or input value change, or value of input is changed | function(value) |  |
| blur | Called when leaving the component. | function() |  |
| focus | Called when entering the component | function() |  |
| search | Called when searching items. | function(value) | - |  |
| select | Called when a option is selected. param is option's value and option instance. | function(value, option) |  |
| dropdownVisibleChange | Call when dropdown open | function(open) |  |

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | remove focus |         |
| focus() | get focus    |         |
