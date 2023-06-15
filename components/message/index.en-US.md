---
category: Components
type: Feedback
title: Message
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JjZBT6N1MusAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*7qMTRoq3ZGkAAAAAAAAAAAAADrJ8AQ/original
---

Display global messages as feedback in response to user operations.

## When To Use

- To provide feedback such as success, warning, error etc.
- A message is displayed at top and center and will be dismissed automatically, as a non-interrupting light-weighted prompt.

## API

This components provides some static methods, with usage and arguments as following:

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.warn(content, [duration], onClose)` // alias of warning
- `message.loading(content, [duration], onClose)`

| Argument | Description | Type | Default |
| --- | --- | --- | --- |
| content | content of the message | string\| VNode \| () => VNode | - |
| duration | time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 1.5 |
| onClose | Specify a function that will be called when the message is closed | function | - |

`afterClose` can be called in then-able interface:

- `message[level](content, [duration]).then(afterClose)`
- `message[level](content, [duration], onClose).then(afterClose)`

where `level` refers one static methods of `message`. The result of `then` method will be a Promise.

- `message.open(config)`
- `message.success(config)`
- `message.error(config)`
- `message.info(config)`
- `message.warning(config)`
- `message.warn(config)` // alias of warning
- `message.loading(config)`

The properties of config are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| class | Customized CSS class | string | - |  |
| content | content of the message | string\| VNode \| () => VNode | - |  |
| duration | time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 3 |  |
| icon | Customized Icon | VNode \| ()=> VNode | - |  |
| key | The unique identifier of the Message | string\|number | - |  |
| style | Customized inline style | CSSProperties | - |  |
| onClick | Specify a function that will be called when the message is clicked | function | - |  |
| onClose | Specify a function that will be called when the message is closed | function | - |  |

### Global static methods

Methods for global configuration and destruction are also provided:

- `message.config(options)`
- `message.destroy()`
- `message.useMessage()`

#### message.config

```js
message.config({
  top: '100px',
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
});
```

| Argument | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | time before auto-dismiss, in seconds | number | 1.5 |  |
| getContainer | Return the mount node for Message | () => HTMLElement | () => document.body |  |
| maxCount | max message show, drop oldest if exceed limit | number | - |  |
| prefixCls | The prefix className of message node | string | `ant-message` | 3.0 |
| rtl | Whether to enable RTL mode | boolean | false | 3.0 |
| top | distance from top | string | `8px` |  |

## FAQ

### Why I can not access context, Pinia, ConfigProvider `locale/prefixCls/theme` in message?

antdv will dynamic create Vue instance by `Vue.render` when call message methods. Whose context is different with origin code located context.

When you need context info (like ConfigProvider context), you can use `message.useMessage` to get `api` instance and `contextHolder` node. And put it in your children:

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

**Note:** You must insert `contextHolder` into your children with hooks. You can use origin method if you do not need context connection.

> [App Package Component](/components/app) can be used to simplify the problem of `useMessage` and other methods that need to manually implant contextHolder.

### How to set static methods prefixCls ？

You can config with [`ConfigProvider.config`](/components/config-provider#configproviderconfig-4130)
