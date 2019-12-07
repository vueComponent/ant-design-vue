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

Some component use dynamic style to support wave effect. You can config `csp` prop if Content Security Policy (CSP) is enabled:

```html
<a-config-provider :csp="{ nonce: 'YourNonceCode' }">
  <a-button>My Button</a-button>
</a-config-provider>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autoInsertSpaceInButton | Set `false` to remove space between 2 chinese characters on Button | boolean | true |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | { nonce: string } | - |
| renderEmpty | set empty content of components. Ref [Empty](/components/empty/) | slot-scope \| Function(componentName: string): ReactNode | - |
| getPopupContainer | to set the container of the popup element. The default is to create a `div` element in `body`. | Function(triggerNode, dialogContext) | `() => document.body` |
| prefixCls | set prefix class | string | ant |
