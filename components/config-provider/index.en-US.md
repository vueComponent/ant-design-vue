---
category: Components
type: Other
cols: 1
title: ConfigProvider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original
---

`ConfigProvider` provides a uniform configuration support for components.

## Usage

This component provides a configuration to all Vue components underneath itself via the [provide / inject](https://vuejs.org/v2/api/#provide-inject), In the render tree all components will have access to the provided config.

```html
<template>
  <a-config-provider :getPopupContainer="getPopupContainer">
    <app />
  </a-config-provider>
</template>
<script>
  export default {
    methods: {
      getPopupContainer(el, dialogContext) {
        if (dialogContext) {
          return dialogContext.getDialogWrap();
        } else {
          return document.body;
        }
      },
    },
  };
</script>
```

### Content Security Policy

Some components use dynamic style to support wave effect. You can config `csp` prop if Content Security Policy (CSP) is enabled:

```html
<a-config-provider :csp="{ nonce: 'YourNonceCode' }">
  <a-button>My Button</a-button>
</a-config-provider>
```

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoInsertSpaceInButton | Set `false` to remove space between 2 chinese characters on Button | boolean | true |  |
| componentSize | Config antd component size | `small` \| `middle` \| `large` | - | 3.0 |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | { nonce: string } | - |  |
| direction | Set direction of layout. See [demo](#components-config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` | 3.0 |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | - | 3.0 |
| form | Set Form common props | { validateMessages?: [ValidateMessages](/components/form/#validatemessages), requiredMark?: boolean \| `optional` } | - | 3.0 |
| getPopupContainer | to set the container of the popup element. The default is to create a `div` element in `body`. | Function(triggerNode, dialogContext) | `() => document.body` |  |
| getTargetContainer | Config Affix, Anchor scroll target container | () => HTMLElement | () => window | 3.0 |
| input | Set Input common props | { autocomplete?: string } | - | 3.0 |
| locale | language package setting, you can find the packages in [ant-design-vue/es/locale](http://unpkg.com/ant-design-vue/es/locale/) | object | - | 1.5.0 |
| pageHeader | Unify the ghost of pageHeader ,Ref [pageHeader]\(&lt;(/components/page-header)> | { ghost:boolean } | 'true' | 1.5.0 |
| prefixCls | set prefix class | string | ant |  |
| renderEmpty | set empty content of components. Ref [Empty](/components/empty/) | slot-scope \| Function(componentName: string): VNode | - |  |
| space | Set Space `size`, ref [Space](/components/space) | { size: `small` \| `middle` \| `large` \| `number` } | - | 3.0 |
| transformCellText | Table data can be changed again before rendering. The default configuration of general user empty data. | Function({ text, column, record, index }) => any | - | 1.5.4 |
| virtual | Disable virtual scroll when set to false | boolean | true | 3.0 |

### ConfigProvider.config() `3.0.0+`

Setting `Modal`、`Message`、`Notification` rootPrefixCls.

```jsx
ConfigProvider.config({
  prefixCls: 'ant',
});
```

or

```jsx
// some cinfig support reactively, you can change prefixCls.value = 'other'
const prefixCls = ref('ant');
ConfigProvider.config({
  prefixCls,
});
```

## FAQ

#### Does the locale problem still exist in DatePicker even if ConfigProvider `locale` is used?

Please make sure you set dayjs locale by `dayjs.locale('zh-cn')` or that you don't have two different versions of dayjs.

#### Modal throw error when setting `getPopupContainer`?

When you config `getPopupContainer` to parentNode globally, Modal will throw error of `triggerNode is undefined` because it did not have a triggerNode.

```diff
 <ConfigProvider
-  getPopupContainer={triggerNode => triggerNode.parentNode}
+  getPopupContainer={node => {
+    if (node) {
+      return node.parentNode;
+    }
+    return document.body;
+  }}
 >
   <App />
 </ConfigProvider>
```

#### Why can't ConfigProvider props (like `prefixCls` and `theme`) affect VueNode inside `message.info`, `notification.open`, `Modal.confirm`?

antd will dynamic create Vue instance by `Vue.render` when call message methods. Whose context is different with origin code located context.
