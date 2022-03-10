---
category: Components
type: Feedback
title: Notification
cover: https://gw.alipayobjects.com/zos/alicdn/Jxm5nw61w/Notification.svg
---

Display a notification message globally.

## When To Use

To display a notification message at any of the four corners of the viewport. Typically it can be used in the following cases:

- A notification with complex content.
- A notification providing a feedback based on the user interaction. Or it may show some details about upcoming steps the user may have to follow.
- A notification that is pushed by the application.

## API

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.warn(config)`
- `notification.open(config)`
- `notification.close(key: String)`
- `notification.destroy()`

The properties of config are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottomRight` or `bottomLeft` (unit: pixels). | string | `24px` |  |
| btn | Customized close button | VNode \| () => VNode | - |  |
| class | Customized CSS class | string | - |  |
| closeIcon | custom close icon | VNode \| () => VNode | - |  |
| description | The content of notification box (required) | string\| VNode \| () => VNode | - |  |
| duration | Time in seconds before Notification is closed. When set to 0 or null, it will never be closed automatically | number | 4.5 |  |
| getContainer | Return the mount node for Notification | () => HTMLNode | () => document.body |  |
| icon | Customized icon | VNode \| () => VNode | - |  |
| key | The unique identifier of the Notification | string | - |  |
| message | The title of notification box (required) | string\| VNode \| () => VNode | - |  |
| placement | Position of Notification, can be one of `topLeft` `topRight` `bottomLeft` `bottomRight` | string | `topRight` |  |
| style | Customized inline style | Object \| string | - |  |
| top | Distance from the top of the viewport, when `placement` is `topRight` or `topLeft` (unit: pixels). | string | `24px` |  |
| onClick | Specify a function that will be called when the notification is clicked | Function | - |  |
| onClose | Specify a function that will be called when the close button is clicked | Function | - |  |

`notification` also provides a global `config()` method that can be used for specifying the default options. Once this method is used, all the notification boxes will take into account these globally defined options when displaying.

- `notification.config(options)`

  > When you use `ConfigProvider` for global configuration, the system will automatically start RTL mode by default.(4.3.0+)
  >
  > When you want to use it alone, you can start the RTL mode through the following settings.

```js
notification.config({
  placement: 'bottomRight',
  bottom: '50px',
  duration: 3,
  rtl: true,
});
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottomRight` or `bottomLeft` (unit: pixels). | string | `24px` |  |
| closeIcon | custom close icon | VNode \| () => VNode | - |  |
| duration | Time in seconds before Notification is closed. When set to 0 or null, it will never be closed automatically | number | 4.5 |  |
| getContainer | Return the mount node for Notification | () => HTMLNode | () => document.body |  |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | 3.0 |
| placement | Position of Notification, can be one of `topLeft` `topRight` `bottomLeft` `bottomRight` | string | `topRight` |  |
| rtl | Whether to enable RTL mode | boolean | false |  |
| top | Distance from the top of the viewport, when `placement` is `topRight` or `topLeft` (unit: pixels). | string | `24px` |  |
