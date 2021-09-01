---
category: Components
type: 反馈
title: Message
subtitle: 全局提示
cover: https://gw.alipayobjects.com/zos/alicdn/hAkKTIW0K/Message.svg
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

| 参数     | 说明                                          | 类型           | 默认值 |
| -------- | --------------------------------------------- | -------------- | ------ |
| content  | 提示内容                                      | string\| VNode | -      |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭。 | number         | 3      |
| onClose  | 关闭时触发的回调函数                          | Function       | -      |

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

| 参数     | 说明                                          | 类型           | 默认值 | 版本  |
| -------- | --------------------------------------------- | -------------- | ------ | ----- |
| content  | 提示内容                                      | string\| VNode | -      |       |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭。 | number         | 3      |       |
| onClose  | 关闭时触发的回调函数                          | Function       | -      |       |
| icon     | 自定义图标                                    | VNode          | -      |       |
| key      | 当前提示的唯一标志                            | string\|number | -      |       |

### 全局方法

还提供了全局配置和全局销毁方法：

- `message.config(options)`
- `message.destroy()`

#### message.config

```js
message.config({
  top: `100px`,
  duration: 2,
  maxCount: 3,
});
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| duration | 默认自动关闭延时，单位秒 | number | 3 |
| getContainer | 配置渲染节点的输出位置 | () => HTMLElement | () => document.body |
| maxCount | 最大显示数, 超过限制时，最早的消息会被自动关闭 | number | - |
| top | 消息距离顶部的位置 | string | `24px` |
