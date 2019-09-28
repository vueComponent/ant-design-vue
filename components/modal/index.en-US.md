## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely. | function | - |
| bodyStyle | Body style for modal body element. Such as height, padding etc. | object | {} |
| cancelText | Text of the Cancel button | string\|slot | `Cancel` |
| centered | Centered Modal | Boolean | `false` |
| closable | Whether a close (x) button is visible on top right of the modal dialog or not | boolean | true |
| confirmLoading | Whether to apply loading visual effect for OK button or not | boolean | false |
| destroyOnClose | Whether to unmount child components on onClose | boolean | false |
| footer | Footer content, set as `:footer="null"` when you don't need default buttons | string\|slot | OK and Cancel buttons |
| forceRender | Force render Modal | boolean | false |
| getContainer | Return the mount node for Modal | (instance): HTMLElement | () => document.body |
| mask | Whether show mask or not. | Boolean | true |
| maskClosable | Whether to close the modal dialog when the mask (area outside the modal) is clicked | boolean | true |
| maskStyle | Style for modal's mask element. | object | {} |
| okText | Text of the OK button | string\|slot | `OK` |
| okType | Button `type` of the OK button | string | `primary` |
| okButtonProps | The ok button props, follow jsx [rules](https://github.com/vuejs/babel-plugin-transform-vue-jsx#difference-from-react-jsx) | {props: [ButtonProps](/components/button/#API), on: {}} | - |
| cancelButtonProps | The cancel button props, follow jsx [rules](https://github.com/vuejs/babel-plugin-transform-vue-jsx#difference-from-react-jsx) | {props: [ButtonProps](/components/button/#API), on: {}} | - |
| title | The modal dialog's title | string\|slot | - |
| visible | Whether the modal dialog is visible or not | boolean | false |
| width | Width of the modal dialog | string\|number | 520 |
| wrapClassName | The class name of the container of the modal dialog | string | - |
| zIndex | The `z-index` of the Modal | Number | 1000 |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| cancel | Specify a function that will be called when a user clicks mask, close button on top right or Cancel button | function(e) |
| ok | Specify a function that will be called when a user clicks the OK button | function(e) |

#### Note

> The state of Modal will be preserved at it's component lifecycle by default, if you wish to open it with a brand new state everytime, set `destroyOnClose` on it.

### Modal.method()

There are five ways to display the information based on the content's nature:

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

The items listed above are all functions, expecting a settings object as parameter. The properties of the object are follows:

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autoFocusButton | Specify which button to autofocus | null\|string: `ok` `cancel` | `ok` |
| cancelText | Text of the Cancel button | string | `Cancel` |
| centered | Centered Modal | Boolean | `false` |
| closable | Whether a close (x) button is visible on top right of the modal dialog or not | boolean | `false` |
| class | class of container | string | - |
| content | Content | string\|vNode \|function(h) | - |
| icon | custom icon (`Added in 1.14.0`) | string\|()=>VNode | `<Icon type="question-circle">` |
| iconType | Icon `type` of the Icon component (deperated after `1.14.0`) | string | `question-circle` |
| keyboard | Whether support press esc to close | Boolean | true |
| mask | Whether show mask or not. | Boolean | true |
| maskClosable | Whether to close the modal dialog when the mask (area outside the modal) is clicked | Boolean | `false` |
| okText | Text of the OK button | string | `OK` |
| okType | Button `type` of the OK button | string | `primary` |
| okButtonProps | The ok button props | [ButtonProps](/components/button) | - |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button) | - |
| title | Title | string\|vNode \|function(h) | - |
| width | Width of the modal dialog | string\|number | 416 |
| zIndex | The `z-index` of the Modal | Number | 1000 |
| onCancel | Specify a function that will be called when the user clicks the Cancel button. The parameter of this function is a function whose execution should include closing the dialog. You can also just return a promise and when the promise is resolved, the modal dialog will also be closed | function | - |
| onOk | Specify a function that will be called when the user clicks the OK button. The parameter of this function is a function whose execution should include closing the dialog. You can also just return a promise and when the promise is resolved, the modal dialog will also be closed | function | - |

All the `Modal.method`s will return a reference, and then we can update and close the modal dialog by the reference.

```jsx
const modal = Modal.info();

modal.update({
  title: 'Updated title',
  content: 'Updated content',
});

modal.destroy();
```

- `Modal.destroyAll`

`Modal.destroyAll()` could destroy all confirmation modal dialogs(Modal.info/Modal.success/Modal.error/Modal.warning/Modal.confirm). Usually, you can use it in router change event to destroy confirm modal dialog automatically without use modal reference to close( it's too complex to use for all modal dialogs)

```jsx
const router = new VueRouter({ ... })

// router change
router.beforeEach((to, from, next) => {
  Modal.destroyAll();
})
```
