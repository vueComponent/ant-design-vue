---
category: Components
type: 反馈
title: Notification
subtitle: 通知提醒框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*6RWNQ78WtvEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*9hTIToR-3YYAAAAAAAAAAAAADrJ8AQ/original
---

全局展示通知提醒信息。

## 何时使用

在系统四个角显示通知提醒信息。经常用于以下情况：

- 较为复杂的通知内容。
- 带有交互的通知，给出用户下一步的行动点。
- 系统主动推送。

## API

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.warn(config)`
- `notification.open(config)`
- `notification.close(key: String)`
- `notification.destroy()`
- `notification.useNotification()`

config 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素。 | string | `24px` |  |
| btn | 自定义关闭按钮 | VNode \| () => VNode | - |  |
| class | 自定义 CSS class | string | - |  |
| closeIcon | 自定义关闭图标 | VNode \| () => VNode | - |  |
| description | 通知提醒内容，必选 | string \| VNode \| () => VNode | - |  |
| duration | 默认 4.5 秒后自动关闭，配置为 null 则不自动关闭 | number | 4.5 |  |
| getContainer | 配置渲染节点的输出位置 | () => HTMLNode | () => document.body |  |
| icon | 自定义图标 | VNode \| () => VNode | - |  |
| key | 当前通知唯一标志 | string | - |  |
| message | 通知提醒标题，必选 | string \| VNode \| () => VNode | - |  |
| placement | 弹出位置，可选 `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | string | `topRight` | `top` `bottom` 3.3.0 |
| style | 自定义内联样式 | Object \| string | - |  |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素。 | string | `24px` |  |
| onClick | 点击通知时触发的回调函数 | Function | - |  |
| onClose | 点击默认关闭按钮时触发的回调函数 | Function | - |  |

还提供了一个全局配置方法，在调用前提前配置，全局一次生效。

- `notification.config(options)`

  > 当你使用 `ConfigProvider` 进行全局化配置时，系统会默认自动开启 RTL 模式。(3.0+)
  >
  > 当你想单独使用，可通过如下设置开启 RTL 模式。

```js
notification.config({
  placement: 'bottomRight',
  bottom: '50px',
  duration: 3,
  rtl: true,
});
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素。 | string | `24px` |  |
| closeIcon | 自定义关闭图标 | VNode \| () => VNode | - |  |
| duration | 默认自动关闭延时，单位秒 | number | 4.5 |  |
| getContainer | 配置渲染节点的输出位置 | () => HTMLNode | () => document.body |  |
| maxCount | 最大显示数, 超过限制时，最早的消息会被自动关闭 | number | - | 3.0 |
| placement | 弹出位置，可选 `topLeft` `topRight` `bottomLeft` `bottomRight` | string | topRight |  |
| rtl | 是否开启 RTL 模式 | boolean | false | 3.0 |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素。 | string | `24px` |  |

## FAQ

### 为什么 notification 不能获取 context、Pinia 的内容和 ConfigProvider 的 `locale/prefixCls/theme` 等配置？

直接调用 notification 方法，antdv 会通过 `Vue.render` 动态创建新的 Vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `notification.useNotification` 方法会返回 `api` 实体以及 `contextHolder` 节点。将其插入到你需要获取 context 位置即可：

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { notification } from 'ant-design-vue';
  const [notificationApi, contextHolder] = notification.useNotification();
  notificationApi.open({
    // ...
  });
</script>
```

**异同**：通过 hooks 创建的 `contextHolder` 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用。

> 可通过 [App 包裹组件](/components/app-cn) 简化 `useNotification` 等方法需要手动植入 contextHolder 的问题。

### 静态方法如何设置 prefixCls ？

你可以通过 [`ConfigProvider.config`](/components/config-provider-cn#configproviderconfig-4130) 进行设置。
