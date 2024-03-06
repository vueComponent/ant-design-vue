---
category: Components
type: Feedback
title: Modal
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wM3qQ5XrhlcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fBrgSJBmavgAAAAAAAAAAAAADrJ8AQ/original
---

Modal dialogs.

## When To Use

When requiring users to interact with the application, but without jumping to a new page and interrupting the user's workflow, you can use `Modal` to create a new floating layer over the current page to get user feedback or display information. Additionally, if you need show a simple confirmation dialog, you can use `antd.Modal.confirm()`, and so on.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely. | function | - |  |
| bodyStyle | Body style for modal body element. Such as height, padding etc. | object | {} |  |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#api) | - |  |
| cancelText | Text of the Cancel button | string\|slot | `Cancel` |  |
| centered | Centered Modal | boolean | `false` |  |
| closable | Whether a close (x) button is visible on top right of the modal dialog or not | boolean | true |  |
| closeIcon | custom close icon | VNode \| slot | - |  |
| confirmLoading | Whether to apply loading visual effect for OK button or not | boolean | false |  |
| destroyOnClose | Whether to unmount child components on onClose | boolean | false |  |
| footer | Footer content, set as `:footer="null"` when you don't need default buttons | string\|slot | OK and Cancel buttons |  |
| forceRender | Force render Modal | boolean | false |  |
| getContainer | Return the mount node for Modal | (instance): HTMLElement | () => document.body |  |
| mask | Whether show mask or not. | boolean | true |  |
| maskClosable | Whether to close the modal dialog when the mask (area outside the modal) is clicked | boolean | true |  |
| maskStyle | Style for modal's mask element. | object | {} |  |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#api) | - |  |
| okText | Text of the OK button | string\|slot | `OK` |  |
| okType | Button `type` of the OK button | string | `primary` |  |
| title | The modal dialog's title | string\|slot | - |  |
| open(v-model) | Whether the modal dialog is visible or not | boolean | false |  |
| width | Width of the modal dialog | string\|number | 520 |  |
| wrapClassName | The class name of the container of the modal dialog | string | - |  |
| zIndex | The `z-index` of the Modal | number | 1000 |  |

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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| appContext | The context of the pop-up window is generally used to obtain content such as global registered components, vuex, etc. | - | - |  |
| autoFocusButton | Specify which button to autofocus | `null` \| `ok` \| `cancel` | `ok` |  |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button) | - |  |
| cancelText | Text of the Cancel button | string | `Cancel` |  |
| centered | Centered Modal | boolean | `false` |  |
| class | class of container | string | - |  |
| closable | Whether a close (x) button is visible on top right of the modal dialog or not | boolean | `false` |  |
| content | Content | string\|VNode \|function() | - |  |
| footer | Footer content, set as `footer: null` when you don't need default buttons | string\|VNode \|function() | - | 4.0.0 |
| icon | custom icon (`Added in 1.14.0`) | VNode \|()=>VNode | - |  |
| keyboard | Whether support press esc to close | boolean | true |  |
| mask | Whether show mask or not. | boolean | true |  |
| maskClosable | Whether to close the modal dialog when the mask (area outside the modal) is clicked | boolean | `false` |  |
| okButtonProps | The ok button props | [ButtonProps](/components/button) | - |  |
| okText | Text of the OK button | string | `OK` |  |
| okType | Button `type` of the OK button | string | `primary` |  |
| title | Title | string\|VNode \|function() | - |  |
| width | Width of the modal dialog | string\|number | 416 |  |
| wrapClassName | The class name of the container of the modal dialog | string | - | 3.2.3 |
| zIndex | The `z-index` of the Modal | number | 1000 |  |
| onCancel | Specify a function that will be called when the user clicks the Cancel button. The parameter of this function is a function whose execution should include closing the dialog. You can also just return a promise and when the promise is resolved, the modal dialog will also be closed | function | - |  |
| onOk | Specify a function that will be called when the user clicks the OK button. The parameter of this function is a function whose execution should include closing the dialog. You can also just return a promise and when the promise is resolved, the modal dialog will also be closed | function | - |  |

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

### Modal.useModal()

When you need using Context, you can use `contextHolder` which created by `Modal.useModal` to insert into children. Modal created by hooks will get all the context where `contextHolder` are. Created `modal` has the same creating function with `Modal.method`.

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { Modal } from 'ant-design-vue';
  const [modal, contextHolder] = Modal.useModal();

  modal.confirm({
    // ...
  });
</script>
```

## FAQ

### Why can't the Modal method obtain global registered components, context, vuex, etc. and ConfigProvider `locale/prefixCls/theme` configuration, and can't update data responsively?

Call the Modal method directly, and the component will dynamically create a new Vue entity through `Vue.render`. Its context is not the same as the context where the current code is located, so the context information cannot be obtained.

When you need context information (for example, using a globally registered component), you can use `Modal.useModal` to get `modal` instance and `contextHolder` node. And put it in your children:

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { Modal } from 'ant-design-vue';
  const [modal, contextHolder] = Modal.useModal();

  modal.confirm({
    // ...
  });
</script>
```

> [App Package Component](/components/app) can be used to simplify the problem of `useModal` and other methods that need to manually implant contextHolder.
