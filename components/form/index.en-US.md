## API

### Form

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| form | Decorated by `Form.create()` will be automatically set `this.form` property, so just pass to form. If you use the template syntax, you can use `this.$form.createForm(this, options)` | object | n/a |
| hideRequiredMark | Hide required mark of all form items | Boolean | false |
| layout | Define form layout | 'horizontal'\|'vertical'\|'inline' | 'horizontal' |
| labelCol | The layout of label. You can set `span` `offset` to something like `{span: 3, offset: 12}` or `sm: {span: 3, offset: 12}` same as with `<Col>` | [object](/components/grid/#Col) |  |
| wrapperCol | The layout for input controls, same as `labelCol` | [object](/components/grid/#Col) |  |
| autoFormCreate(deprecated) | Automate Form.create, Recommended for use under the `template` component, and cannot be used with `Form.create()`. You should use `$form.createForm` to instead it after 1.1.9. | Function(form) |  |
| options(deprecated) | The `options` corresponding to `Form.create(options)`. You should use `$form.createForm` to instead it after 1.1.9. | Object | {} |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| submit | Defines a function will be called if form data validation is successful. | Function(e:Event) |

### Form.create(options) \| this.\$form.createForm(this, options)

How to use：

#### Used in jsx, the usage is consistent with the React version of antd

```jsx
const CustomizedForm = {};

CustomizedForm = Form.create({})(CustomizedForm);
```

Maintain an ref for wrapped component instance, use `wrappedComponentRef`.

#### Single file template usage

```html
<template>
  <a-form :form="form" />
</template>
<script>
  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, options);
    },
  };
</script>
```

The following `options` are available:

| Property | Description | Type |
| --- | --- | --- |
| props | Only supports the use of Form.create({})(CustomizedForm). declare props on form(和[like vue props](https://vuejs.org/v2/api/#props)) | {} |
| mapPropsToFields | Convert props to field value(e.g. reading the values from Redux store). And you must mark returned fields with [`Form.createFormField`](#Form.createFormField). If you use `$form.createForm` to create a collector, you can map any data to the Field without being bound by the parent component. | (props) => Object{ fieldName: FormField { value } } |
| name | Set the id prefix of fields under form | - |
| validateMessages | Default validate message. And its format is similar with [newMessages](https://github.com/yiminghe/async-validator/blob/master/src/messages.js)'s returned value | Object { [nested.path]&#x3A; String } |
| onFieldsChange | Specify a function that will be called when the value a `Form.Item` gets changed. Usage example: saving the field's value to Redux store. | Function(props, fields) |
| onValuesChange | A handler while value of any field is changed | (props, values) => void |

If the form has been decorated by `Form.create` then it has `this.form` property. `this.form` provides some APIs as follows:

> Note: Before using `getFieldsValue` `getFieldValue` `setFieldsValue` and so on, please make sure that corresponding field had been registered with `getFieldDecorator` or `v-decorator`.

| Method | Description | Type |
| --- | --- | --- |
| getFieldDecorator | Two-way binding for form, single file template can be bound using the directive `v-decorator`. please read below for details. |  |
| getFieldError | Get the error of a field. | Function(name) |
| getFieldsError | Get the specified fields' error. If you don't specify a parameter, you will get all fields' error. | Function(\[names: string\[]]) |
| getFieldsValue | Get the specified fields' values. If you don't specify a parameter, you will get all fields' values. | Function(\[fieldNames: string\[]]) |
| getFieldValue | Get the value of a field. | Function(fieldName: string) |
| isFieldsTouched | Check whether any of fields is touched by `getFieldDecorator`'s or `v-decorator`'s `options.trigger` event | (names?: string\[]) => boolean |
| isFieldTouched | Check whether a field is touched by `getFieldDecorator`'s or `v-decorator`'s `options.trigger` event | (name: string) => boolean |
| isFieldValidating | Check if the specified field is being validated. | Function(name) |
| resetFields | Reset the specified fields' value(to `initialValue`) and status. If you don't specify a parameter, all the fields will be reset. | Function(\[names: string\[]]) |
| setFields | Set value and error state of fields. | ({<br />&nbsp;&nbsp;\[fieldName\]: {value: any, errors: \[Error\] }<br />}) => void |
| setFieldsValue | Set the value of a field. | Function({ [fieldName]&#x3A; value }) |
| validateFields | Validate the specified fields and get theirs values and errors. If you don't specify the parameter of fieldNames, you will validate all fields. | (<br />&nbsp;&nbsp;\[fieldNames: string\[]],<br />&nbsp;&nbsp;\[options: object\],<br />&nbsp;&nbsp;callback(errors, values)<br />) => void |
| validateFieldsAndScroll | This function is similar to `validateFields`, but after validation, if the target field is not in visible area of form, form will be automatically scrolled to the target field area. | same as `validateFields` |

### validateFields/validateFieldsAndScroll

```jsx
const {
  form: { validateFields },
} = this;
validateFields((errors, values) => {
  // ...
});
validateFields(['field1', 'field2'], (errors, values) => {
  // ...
});
validateFields(['field1', 'field2'], options, (errors, values) => {
  // ...
});
```

| Method | Description | Type | Default |
| --- | --- | --- | --- |
| options.first | If `true`, every field will stop validation at first failed rule | boolean | false |
| options.firstFields | Those fields will stop validation at first failed rule | String\[] | \[] |
| options.force | Should validate validated field again when `validateTrigger` is been triggered again | boolean | false |
| options.scroll | Config scroll behavior of `validateFieldsAndScroll`, more: [dom-scroll-into-view's config](https://github.com/yiminghe/dom-scroll-into-view#function-parameter) | Object | {} |

#### Callback arguments example of validateFields

- `errors`:

  ```js
  {
    "userName": {
      "errors": [
        {
          "message": "Please input your username!",
          "field": "userName"
        }
      ]
    },
    "password": {
      "errors": [
        {
          "message": "Please input your Password!",
          "field": "password"
        }
      ]
    }
  }
  ```

- `values`:

  ```js
  {
    "userName": "username",
    "password": "password",
  }
  ```

### Form.createFormField

To mark the returned fields data in `mapPropsToFields`, [demo](#components-form-demo-global-state).

### this.form.getFieldDecorator(id, options) and v-decorator="[id, options]"

After wrapped by `getFieldDecorator` or `v-decorator`, `value`(or other property defined by `valuePropName`) `onChange`(or other property defined by `trigger`) props will be added to form controls，the flow of form data will be handled by Form which will cause:

1. You shouldn't use `onChange` to collect data, but you still can listen to `onChange`(and so on) events.
2. You cannot set value of form control via `value` `defaultValue` prop, and you should set default value with `initialValue` in `getFieldDecorator` or `v-decorator` instead.
3. You shouldn't call `v-model` manually, please use `this.form.setFieldsValue` to change value programmatically.

#### Special attention

1. `getFieldDecorator` and `v-decorator` can not be used to decorate stateless component.
2. you can't use `getFieldDecorator` and `v-decorator` in stateless component: <https://vuejs.org/v2/api/#functional>

#### getFieldDecorator(id, options) and v-decorator="[id, options]" parameters

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| id | The unique identifier is required. support [nested fields format](https://github.com/react-component/form/pull/48). | string |  |
| options.getValueFromEvent | Specify how to get value from event or other onChange arguments | function(..args) | [reference](https://github.com/react-component/form#option-object) |
| options.getValueProps | Get the component props according to field value. | function(value): any | [reference](https://github.com/react-component/form#option-object) |
| options.initialValue | You can specify initial value, type, optional value of children node. (Note: Because `Form` will test equality with `===` internally, we recommend to use variable as `initialValue`, instead of literal) |  | n/a |
| options.normalize | Normalize value to form component, [a select-all example](https://codesandbox.io/s/kw4l2vqqmv) | function(value, prevValue, allValues): any | - |
| options.preserve | Keep the field even if field removed | boolean | false |
| options.rules | Includes validation rules. Please refer to "Validation Rules" part for details. | object\[] | n/a |
| options.trigger | When to collect the value of children node | string | 'change' |
| options.validateFirst | Whether stop validate on first rule of error for this field. | boolean | false |
| options.validateTrigger | When to validate the value of children node. | string\|string\[] | 'change' |
| options.valuePropName | Props of children node, for example, the prop of Switch is 'checked'. | string | 'value' |

### Form.Item

Note: If Form.Item has multiple children that had been decorated by `getFieldDecorator` or `v-decorator`, `help` and `required` and `validateStatus` can't be generated automatically.

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| colon | Used with `label`, whether to display `:` after label text. | boolean | true |
| extra | The extra prompt message. It is similar to help. Usage example: to display error message and prompt message at the same time. | string\|slot |  |
| hasFeedback | Used with `validateStatus`, this option specifies the validation status icon. Recommended to be used only with `Input`. | boolean | false |
| help | The prompt message. If not provided, the prompt message will be generated by the validation rule. | string\|slot |  |
| label | Label text | string\|slot |  |
| labelCol | The layout of label. You can set `span` `offset` to something like `{span: 3, offset: 12}` or `sm: {span: 3, offset: 12}` same as with `<Col>` | [object](/components/grid/#Col) |  |
| required | Whether provided or not, it will be generated by the validation rule. | boolean | false |
| validateStatus | The validation status. If not provided, it will be generated by validation rule. options: 'success' 'warning' 'error' 'validating' | string |  |
| wrapperCol | The layout for input controls, same as `labelCol` | [object](/components/grid/#Col) |  |

### Validation Rules

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| enum | validate a value from a list of possible values | string | - |
| len | validate an exact length of a field | number | - |
| max | validate a max length of a field | number | - |
| message | validation error message | string | - |
| min | validate a min length of a field | number | - |
| pattern | validate from a regular expression | RegExp | - |
| required | indicates whether field is required | boolean | `false` |
| transform | transform a value before validation | function(value) => transformedValue:any | - |
| type | built-in validation type, [available options](https://github.com/yiminghe/async-validator#type) | string | 'string' |
| validator | custom validate function (Note: [callback must be called](https://github.com/ant-design/ant-design/issues/5155)) | function(rule, value, callback) | - |
| whitespace | treat required fields that only contain whitespace as errors | boolean | `false` |

See more advanced usage at [async-validator](https://github.com/yiminghe/async-validator).
