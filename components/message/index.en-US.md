---
category: Components
type: Feedback
title: Message
cover: https://gw.alipayobjects.com/zos/alicdn/hAkKTIW0K/Message.svg
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
| content | content of the message | string\| VNode | - |
| duration | time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 1.5 |
| onClose | Specify a function that will be called when the message is closed | Function | - |

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
| content | content of the message | string\| VNode | - |  |
| duration | time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 3 |  |
| onClose | Specify a function that will be called when the message is closed | function | - |  |
| icon | Customized Icon | VNode | - |  |
| key | The unique identifier of the Message | string\|number | - |  |

### Global static methods

Methods for global configuration and destruction are also provided:

- `message.config(options)`
- `message.destroy()`

#### message.config

```js
message.config({
  top: '100px',
  duration: 2,
  maxCount: 3,
});
```

| Argument | Description | Type | Default |
| --- | --- | --- | --- |
| duration | time before auto-dismiss, in seconds | number | 1.5 |
| getContainer | Return the mount node for Message | () => HTMLElement | () => document.body |
| maxCount | max message show, drop oldest if exceed limit | number | - |
| top | distance from top | string | `24px` |
