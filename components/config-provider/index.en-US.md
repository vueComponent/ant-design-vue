---
category: Components
type: Other
cols: 1
title: ConfigProvider
cover: https://gw.alipayobjects.com/zos/alicdn/kegYxl1wj/ConfigProvider.svg
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
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | { nonce: string } | - |  |
| renderEmpty | set empty content of components. Ref [Empty](/components/empty/) | slot-scope \| Function(componentName: string): ReactNode | - |  |
| getPopupContainer | to set the container of the popup element. The default is to create a `div` element in `body`. | Function(triggerNode, dialogContext) | `() => document.body` |  |
| locale | language package setting, you can find the packages in [ant-design-vue/es/locale](http://unpkg.com/ant-design-vue/es/locale/) | object | - | 1.5.0 |
| prefixCls | set prefix class | string | ant |  |
| pageHeader | Unify the ghost of pageHeader ,Ref [pageHeader](<(/components/page-header)> | { ghost:boolean } | 'true' | 1.5.0 |
| transformCellText | Table data can be changed again before rendering. The default configuration of general user empty data. | Function({ text, column, record, index }) => any | - | 1.5.4 ｜ |

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
