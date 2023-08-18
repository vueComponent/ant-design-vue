---
category: Components
type: Data Entry
title: Input
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Y3R0RowXHlAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sBqqTatJ-AkAAAAAAAAAAAAADrJ8AQ/original
---

A basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.

## When To Use

- A user input in a form field is needed.
- A search input is required.

## API

### Input

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| addonAfter | The label text displayed after (on the right side of) the input field. | string\|slot |  |  |
| addonBefore | The label text displayed before (on the left side of) the input field. | string\|slot |  |  |
| allowClear | allow to remove input content with clear icon | boolean |  |  |
| bordered | Whether has border style | boolean | true | 4.5.0 |
| clearIcon | custom clear icon when allowClear | slot | `<CloseCircleFilled />` | 3.3.0 |
| defaultValue | The initial input content | string |  |  |
| disabled | Whether the input is disabled. | boolean | false |  |
| id | The ID for input | string |  |  |
| maxlength | max length | number |  | 1.5.0 |
| prefix | The prefix icon for the Input. | string\|slot |  |  |
| showCount | Whether show text count | boolean | false | 3.0 |
| status | Set validation status | 'error' \| 'warning' | - | 3.3.0 |
| size | The size of the input box. Note: in the context of a form, the `middle` size is used. Available: `large` `middle` `small` | string | - |  |
| suffix | The suffix icon for the Input. | string\|slot |  |  |
| type | The type of input, see: [MDN](https://developer.mozilla.org/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)(use `<a-textarea />` instead of `type="textarea"`) | string | `text` |  |
| value(v-model) | The input content value | string |  |  |

### Input Events

| Events Name | Description | Arguments |  |
| --- | --- | --- | --- |
| change | callback when user input | function(e) |  |
| pressEnter | The callback function that is triggered when Enter key is pressed. | function(e) |  |

> When `Input` is used in a `Form.Item` context, if the `Form.Item` has the `id` and `options` props defined then `value`, `defaultValue`, and `id` props of `Input` are automatically set.

### TextArea

| Property | Description | Type | Default | Version |  |
| --- | --- | --- | --- | --- | --- |
| allowClear | allow to remove input content with clear icon | boolean |  | 1.5.0 |  |
| autosize | Height autosize feature, can be set to `true | false`or an object`{ minRows: 2, maxRows: 6 }` | boolean\|object | false |  |
| defaultValue | The initial input content | string |  |  |  |
| showCount | Whether show text count | boolean | false |  |  |
| value(v-model) | The input content value | string |  |  |  |

### TextArea Events

| Events Name | Description                                                        | Arguments   |
| ----------- | ------------------------------------------------------------------ | ----------- |
| pressEnter  | The callback function that is triggered when Enter key is pressed. | function(e) |

The rest of the props of `TextArea` are the same as the original [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

#### Input.Search

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| enterButton | to show an enter button after input. This prop is conflict with addon. | boolean\|slot | false |

### Input.Search Events

| Events Name | Description | Arguments | Version |  |
| --- | --- | --- | --- | --- |
| loading | Search box with loading. | boolean |  |  |
| search | The callback function that is triggered when you click on the search-icon or press Enter key. | function(value, event) |  |  |

Supports all props of `Input`.

#### Input.Group

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| compact | Whether use compact style | boolean | false |
| size | The size of `Input.Group` specifies the size of the included `Input` fields. Available: `large` `default` `small` | string | `default` |

```html
<a-input-group>
  <a-input />
  <a-input />
</a-input-group>
```

#### Input.Password (Added in 1.14.0)

| Property         | Description                                            | Type    | Default |
| ---------------- | ------------------------------------------------------ | ------- | ------- |
| visible(v-model) | password visibility                                    | boolean | false   |
| iconRender       | Custom toggle button                                   | slot    | -       |
| visibilityToggle | Whether show toggle button or control password visible | boolean | true    |
