## 使用

ConfigProvider 使用 Vue 的 [provide / inject](https://vuejs.org/v2/api/#provide-inject) 特性，只需在应用外围包裹一次即可全局生效。

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

部分组件为了支持波纹效果，使用了动态样式。如果开启了 Content Security Policy (CSP)，你可以通过 `csp` 属性来进行配置：

```html
<a-config-provider :csp="{ nonce: 'YourNonceCode' }">
  <a-button>My Button</a-button>
</a-config-provider>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoInsertSpaceInButton | 设置为 `false` 时，移除按钮中 2 个汉字之间的空格 | boolean | true |
| csp | 设置 [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 配置 | { nonce: string } | - |
| renderEmpty | 自定义组件空状态。参考 [空状态](/components/empty/) | slot-scope \| Function(componentName: string): VNode | - |
| getPopupContainer | 弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。 | Function(triggerNode, dialogContext) | () => document.body |
| prefixCls | 设置统一样式前缀 | string | ant |
