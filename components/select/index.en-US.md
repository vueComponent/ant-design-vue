---
category: Components
type: Data Entry
title: Select
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*zo76T7KQx2UAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5oPiTqPxGAUAAAAAAAAAAAAADrJ8AQ/original
---

Select component to select value from options.

## When To Use

- A dropdown menu for displaying choices - an elegant alternative to the native `<select>` element.
- Utilizing [Radio](/components/radio/) is recommended when there are fewer total options (less than 5).

## API

```html
<a-select>
  <a-select-option value="lucy">lucy</a-select-option>
</a-select>
```

### Select props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button. | boolean | false |  |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags`. | boolean | true |  |
| autofocus | Get focus by default | boolean | false |  |
| bordered | Whether has border style | boolean | true |  |
| clearIcon | The custom clear icon | VNode \| slot | - |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| disabled | Whether disabled select | boolean | false |  |
| popupClassName | className of dropdown menu | string | - | 4.0 |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true |  |
| dropdownMenuStyle | additional style applied to dropdown menu | object | - |  |
| dropdownRender | Customize dropdown content | ({menuNode: VNode, props}) => VNode \| v-slot | - |  |
| dropdownStyle | style of dropdown menu | object | - |  |
| fieldNames | Customize node label, value, options field name | object | { label: `label`, value: `value`, options: `options` } | 3.0 |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | `boolean` \| `function(inputValue, option)` | true |  |
| filterSort | Sort function for search options sorting, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction | (optionA: Option, optionB: Option) => number | - | 3.0 |
| firstActiveValue | Value of action option by default | string \| string\[] | - |  |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. | function(triggerNode) | () => document.body |  |
| labelInValue | whether to embed label in value, turn the format of value from `string` to `{key: string, label: vNodes, originLabel: any}`, originLabel (3.1) maintains the original type. If the node is constructed through a-select-option children, the value is a function (the default slot of a-select-option) | boolean | false |  |
| listHeight | Config popup height | number | 256 |  |
| loading | indicate loading state | boolean | false |  |
| maxTagCount | Max tag count to show | number | - |  |
| maxTagPlaceholder | Placeholder for not showing tags | slot \| function(omittedValues) | - |  |
| maxTagTextLength | Max text length to show | number | - |  |
| menuItemSelectedIcon | The custom menuItemSelected icon | VNode \| slot | - |  |
| mode | Set mode of Select | 'multiple' \| 'tags' | - |  |
| notFoundContent | Specify content to show when no result matches.. | string\|slot | `Not Found` |  |
| open | Controlled open state of dropdown | boolean | - |  |
| option | custom render option by slot | v-slot:option="{value, label, [disabled, key, title]}" | - | 2.2.5 |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true | string | value |  |
| optionLabelProp | Which prop value of option will render as content of select. | string | `children` \| `label`(when use options) |  |
| options | Data of the selectOption, manual construction work is no longer needed if this property has been set | Array&lt;{value, label, [disabled, key, title]}> | \[] |  |
| placeholder | Placeholder of select | string\|slot | - |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | 3.3.0 |
| removeIcon | The custom remove icon | VNode \| slot | - |  |
| searchValue | The current input "search" text | string | - |  |
| showArrow | Whether to show the drop-down arrow | boolean | single:true, multiple:false |  |
| showSearch | Whether select is searchable | boolean | single:false, multiple:true |  |
| size | Size of Select input. `default` `large` `small` | string | default |  |
| status | Set validation status | 'error' \| 'warning' | - | 3.3.0 |
| suffixIcon | The custom suffix icon | VNode \| slot | - |  |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | slot \| (props) => any | - |  |
| tokenSeparators | Separator used to tokenize, only applies when `mode="tags"` | string\[] | - |  |
| value(v-model) | Current selected option. | string\|number\|string\[]\|number\[] | - |  |
| virtual | Disable virtual scroll when set to false | boolean | true | 3.0 |

> Note, if you find that the drop-down menu scrolls with the page, or you need to trigger Select in other popup layers, please try to use `getPopupContainer={triggerNode => triggerNode.parentElement}` to fix the drop-down popup rendering node in the parent element of the trigger .

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| blur | Called when blur | function |
| change | Called when select an option or input value change, or value of input is changed in combobox mode | function(value, option:Option \| Array&lt;Option>) |
| deselect | Called when a option is deselected, the params are option's value (or key) . only called for multiple or tags, effective in multiple or tags mode only. | function(value, option:Option) |
| dropdownVisibleChange | Call when dropdown open | function(open) |
| focus | Called when focus | function |
| inputKeyDown | Called when key pressed | function |
| mouseenter | Called when mouse enter | function |
| mouseleave | Called when mouse leave | function |
| popupScroll | Called when dropdown scrolls | function |
| search | Callback function that is fired when input changed. | function(value: string) |
| select | Called when a option is selected, the params are option's value (or key) and option instance. | function(value, option:Option) |

### Select Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### Option props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| class | additional class to option | string | - |
| disabled | Disable this option | boolean | false |
| key | Same usage as `value`. If Vue request you to set this property, you can set it to value of option, and then omit value property. | string |  |
| title | `title` of Select after select this Option | string | - |
| value | default to filter with this property | string\|number | - |

### OptGroup props

| Property | Description | Type         | Default |
| -------- | ----------- | ------------ | ------- |
| key      |             | string       | -       |
| label    | Group label | string\|slot | -       |

## FAQ

### The dropdown is closed when click `dropdownRender` area?

Dropdown menu will be closed if click `dropdownRender` area, you can prevent the default behavior of a click event, See the [dropdownRender example](#components-select-demo-custom-dropdown-menu).

### Why is `placeholder` not displayed?

`placeholder` will only be displayed when `value = undefined`, and other values such as null, 0,'', etc. are meaningful values for the JS language.

You can check [JS Language Specification](https://262.ecma-international.org/5.1/#sec-4.3.9) for further details.

You can also check [antd issue](https://github.com/ant-design/ant-design/issues/2367) to view the discussion.
