---
category: Components
type: 反馈
title: Message
subtitle: 全局提示
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JjZBT6N1MusAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*7qMTRoq3ZGkAAAAAAAAAAAAADrJ8AQ/original
---

全局展示操作反馈信息。

## 何时使用

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## API

组件提供了一些静态方法，使用方式和参数如下：

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.warn(content, [duration], onClose)` // alias of warning
- `message.loading(content, [duration], onClose)`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | string\| VNode \| () => VNode | - |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭。 | number | 3 |
| onClose | 关闭时触发的回调函数 | function | - |

组件同时提供 promise 接口

- `message[level](content, [duration]).then(afterClose)`
- `message[level](content, [duration], onClose).then(afterClose)`

其中`message[level]` 是组件已经提供的静态方法。`then` 接口返回值是 Promise 。

也可以对象的形式传递参数：

- `message.open(config)`
- `message.success(config)`
- `message.error(config)`
- `message.info(config)`
- `message.warning(config)`
- `message.warn(config)` // alias of warning
- `message.loading(config)`

`config` 对象属性如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| class | 自定义 CSS class | string | - |  |
| content | 提示内容 | string\| VNode \| ()=> VNode | - |  |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭。 | number | 3 |  |
| icon | 自定义图标 | VNode \| () => VNode | - |  |
| key | 当前提示的唯一标志 | string \| number | - |  |
| style | 自定义内联样式 | CSSProperties | - |  |
| onClick | 点击 message 时触发的回调函数 | function | - |  |
| onClose | 关闭时触发的回调函数 | function | - |  |

### 全局方法

还提供了全局配置和全局销毁方法：

- `message.config(options)`
- `message.destroy()`
- `message.useMessage()`

#### message.config

```js
message.config({
  top: `100px`,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
});
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |  |
| --- | --- | --- | --- | --- | --- |
| duration | 默认自动关闭延时，单位秒 | number | 3 |  |  |
| getContainer | 配置渲染节点的输出位置 | () => HTMLElement | () => document.body |  |  |
| maxCount | 最大显示数, 超过限制时，最早的消息会被自动关闭 | number | - |  |  |
| prefixCls | 消息节点的 className 前缀 | string | `ant-message` | 3.0 |  |
| rtl | 是否开启 RTL 模式 | boolean | false |  |  |
| top | 消息距离顶部的位置 | string | `8px` |  |  |

## FAQ

### 为什么 message 不能获取 context、Pinia 的内容和 ConfigProvider 的 `locale/prefixCls/theme` 等配置？

直接调用 message 方法，antdv 会通过 `Vue.render` 动态创建新的 Vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `message.useMessage` 方法会返回 `api` 实体以及 `contextHolder` 节点。将其插入到你需要获取 context 位置即可：

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { message } from 'ant-design-vue';
  const [messageApi, contextHolder] = message.useMessage();
  messageApi.open({
    // ...
  });
</script>
```

**异同**：通过 hooks 创建的 `contextHolder` 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用。

> 可通过 [App 包裹组件](/components/app-cn) 简化 `useMessage` 等方法需要手动植入 contextHolder 的问题。

### 静态方法如何设置 prefixCls ？

你可以通过 [`ConfigProvider.config`](/components/config-provider-cn#configproviderconfig-4130) 进行设置。
