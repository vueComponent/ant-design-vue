## API

### Input

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| addonAfter | The label text displayed after (on the right side of) the input field. | string\|slot |  |
| addonBefore | The label text displayed before (on the left side of) the input field. | string\|slot |  |
| defaultValue | The initial input content | string |  |
| disabled | Whether the input is disabled. | boolean | false |
| id | The ID for input | string |  |
| prefix | The prefix icon for the Input. | string\|slot |  |
| size | The size of the input box. Note: in the context of a form, the `large` size is used. Available: `large` `default` `small` | string | `default` |
| suffix | The suffix icon for the Input. | string\|slot |  |
| type | The type of input, see: [MDN](https://developer.mozilla.org/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)(use `Input.TextArea` instead of `type="textarea"`) | string | `text` |
| value(v-model) | The input content value | string |  |
| allowClear | allow to remove input content with clear icon | boolean |  |

### Input Events

| Events Name | Description                                                        | Arguments   |
| ----------- | ------------------------------------------------------------------ | ----------- |
| change      | callback when user input                                           | function(e) |  |
| pressEnter  | The callback function that is triggered when Enter key is pressed. | function(e) |

> When `Input` is used in a `Form.Item` context, if the `Form.Item` has the `id` and `options` props defined then `value`, `defaultValue`, and `id` props of `Input` are automatically set.

### Input.TextArea

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autosize | Height autosize feature, can be set to `true|false` or an object `{ minRows: 2, maxRows: 6 }` | boolean\|object | false |
| defaultValue | The initial input content | string |  |
| value(v-model) | The input content value | string |  |

### Input.TextArea Events

| Events Name | Description                                                        | Arguments   |
| ----------- | ------------------------------------------------------------------ | ----------- |
| pressEnter  | The callback function that is triggered when Enter key is pressed. | function(e) |

The rest of the props of `Input.TextArea` are the same as the original [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

#### Input.Search

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| enterButton | to show an enter button after input. This prop is conflict with addon. | boolean\|slot | false |

### Input.Search Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| search | The callback function that is triggered when you click on the search-icon or press Enter key. | function(value, event) |

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

| Property         | Description                | Type    | Default |
| ---------------- | -------------------------- | ------- | ------- |
| visibilityToggle | Whether show toggle button | boolean | true    |
