## API

```html
<a-select>
  <a-select-option value="lucy">lucy</a-select-option>
</a-select>
```

### Select props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| allowClear | Show clear button. | boolean | false |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags`. | boolean | true |
| autoFocus | Get focus by default | boolean | false |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |
| defaultValue | Initial selected option. | string\|string\[]<br />number\|number\[] | - |
| disabled | Whether disabled select | boolean | false |
| dropdownClassName | className of dropdown menu | string | - |
| dropdownMatchSelectWidth | Whether dropdown's width is same with select. | boolean | true |
| dropdownRender | Customize dropdown content | (menuNode: VNode, props) => VNode | - |
| dropdownStyle | style of dropdown menu | object | - |
| dropdownMenuStyle | additional style applied to dropdown menu | object | - |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | boolean or function(inputValue, option) | true |
| firstActiveValue | Value of action option by default | string\|string\[] | - |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. | function(triggerNode) | () => document.body |
| labelInValue | whether to embed label in value, turn the format of value from `string` to `{key: string, label: vNodes}` | boolean | false |
| maxTagCount | Max tag count to show | number | - |
| maxTagPlaceholder | Placeholder for not showing tags | slot/function(omittedValues) | - |
| maxTagTextLength | Max text length to show | number | - |
| mode | Set mode of Select | 'default' \| 'multiple' \| 'tags' | 'default' |
| notFoundContent | Specify content to show when no result matches.. | string\|slot | 'Not Found' |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true | string | value |
| optionLabelProp | Which prop value of option will render as content of select. | string | `value` for `combobox`, `children` for other modes |
| placeholder | Placeholder of select | string\|slot | - |
| showSearch | Whether show search input in single mode. | boolean | false |
| showArrow | Whether to show the drop-down arrow | boolean | true |
| size | Size of Select input. `default` `large` `small` | string | default |
| suffixIcon | The custom suffix icon | VNode \| slot | - |
| removeIcon | The custom remove icon | VNode \| slot | - |
| clearIcon | The custom clear icon | VNode \| slot | - |
| menuItemSelectedIcon | The custom menuItemSelected icon | VNode \| slot | - |
| tokenSeparators | Separator used to tokenize on tag/multiple mode | string\[] |  |
| value(v-model) | Current selected option. | string\|number\|string\[]\|number\[] | - |
| options | Data of the selectOption, manual construction work is no longer needed if this property has been set | array&lt;{value, label, [disabled, key, title]}> | \[] |
| defaultOpen | Initial open state of dropdown | boolean | - |
| open | Controlled open state of dropdown | boolean | - |
| loading | indicate loading state | Boolean | false |
| virtual | Disable virtual scroll when set to false | Boolean | false |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| blur | Called when blur | function |
| change | Called when select an option or input value change, or value of input is changed in combobox mode | function(value, option:Option/Array&lt;Option>) |
| deselect | Called when a option is deselected, the params are option's value (or key) . only called for multiple or tags, effective in multiple or tags mode only. | function(value, option:Option) |
| focus | Called when focus | function |
| inputKeydown | Called when key pressed | function |
| mouseenter | Called when mouse enter | function |
| mouseleave | Called when mouse leave | function |
| popupScroll | Called when dropdown scrolls | function |
| search | Callback function that is fired when input changed. | function(value: string) |
| select | Called when a option is selected, the params are option's value (or key) and option instance. | function(value, option:Option) |
| dropdownVisibleChange | Call when dropdown open | function(open) |

### Select Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### Option props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| disabled | Disable this option | boolean | false |
| key | Same usage as `value`. If Vue request you to set this property, you can set it to value of option, and then omit value property. | string |  |
| title | `title` of Select after select this Option | string | - |
| value | default to filter with this property | string\|number | - |
| class | additional class to option | string | - |

### OptGroup props

| Property | Description | Type         | Default |
| -------- | ----------- | ------------ | ------- |
| key      |             | string       | -       |
| label    | Group label | string\|slot | -       |

## FAQ

### The dropdown is closed when click `dropdownRender` area?

See the [dropdownRender example](/components/select/#components-select-demo-custom-dropdown).
