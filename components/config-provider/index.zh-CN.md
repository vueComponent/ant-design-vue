---
category: Components
subtitle: 全局化配置
cols: 1
type: 其他
title: ConfigProvider
cover: https://gw.alipayobjects.com/zos/alicdn/kegYxl1wj/ConfigProvider.svg
---

为组件提供统一的全局化配置。

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

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoInsertSpaceInButton | 设置为 `false` 时，移除按钮中 2 个汉字之间的空格 | boolean | true |  |
| csp | 设置 [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 配置 | { nonce: string } | - |  |
| renderEmpty | 自定义组件空状态。参考 [空状态](/components/empty/) | slot-scope \| Function(componentName: string): VNode | - |  |
| getPopupContainer | 弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。 | Function(triggerNode, dialogContext) | () => document.body |  |
| locale | 语言包配置，语言包可到 [ant-design-vue/es/locale](http://unpkg.com/ant-design-vue/es/locale/) 目录下寻找 | object | - | 1.5.0 |
| pageHeader | 统一设置 pageHeader 的 ghost，参考 [pageHeader](<(/components/page-header)>) | { ghost: boolean } | 'true' | 1.5.0 |
| prefixCls | 设置统一样式前缀。注意：需要配合 `less` 变量 `@ant-prefix` 使用 | string | `ant` |  |
| transformCellText | Table 数据渲染前可以再次改变，一般用户空数据的默认配置 | Function({ text, column, record, index }) => any | - | 1.5.4 ｜ |

### ConfigProvider.config() `3.0.0+`

设置 `Modal`、`Message`、`Notification` rootPrefixCls。

```jsx
ConfigProvider.config({
  prefixCls: 'ant',
});
```

or

```jsx
// 如下配置支持响应式数据，你可以通过 prefixCls.value = 'other' 直接改变
const prefixCls = ref('ant');
ConfigProvider.config({
  prefixCls,
});
```

## FAQ

#### 为什么我使用了 ConfigProvider `locale`，时间类组件的国际化还有问题？

请检查是否设置了 `dayjs.locale('zh-cn')`，或者是否有两个版本的 dayjs 共存。

#### 配置 `getPopupContainer` 导致 Modal 报错？

当如下全局设置 `getPopupContainer` 为触发节点的 parentNode 时，由于 Modal 的用法不存在 `triggerNode`，这样会导致 `triggerNode is undefined` 的报错，需要增加一个判断条件。

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
