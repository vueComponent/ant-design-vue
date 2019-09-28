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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| btn | Customized close button | vueNode \|function(h) | - |
| class | Customized CSS class | string | - |
| description | The content of notification box (required) | string\| vueNode \|function(h) | - |
| duration | Time in seconds before Notification is closed. When set to 0 or null, it will never be closed automatically | number | 4.5 |
| icon | Customized icon | vueNode \|function(h) | - |
| key | The unique identifier of the Notification | string | - |
| message | The title of notification box (required) | string\|vueNode \|function(h) | - |
| placement | Position of Notification, can be one of `topLeft` `topRight` `bottomLeft` `bottomRight` | string | `topRight` |
| style | Customized inline style | Object \| string | - |
| onClose | Specify a function that will be called when the close button is clicked | Function | - |
| onClick | Specify a function that will be called when the notification is clicked | Function | - |

`notification` also provides a global `config()` method that can be used for specifying the default options. Once this method is used, all the notification boxes will take into account these globally defined options when displaying.

- `notification.config(options)`

```js
notification.config({
  placement: 'bottomRight',
  bottom: '50px',
  duration: 3,
});
```

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottomRight` or `bottomLeft` (unit: pixels). | string | `24px` |
| duration | Time in seconds before Notification is closed. When set to 0 or null, it will never be closed automatically | number | 4.5 |
| getContainer | Return the mount node for Notification | () => HTMLNode | () => document.body |
| placement | Position of Notification, can be one of `topLeft` `topRight` `bottomLeft` `bottomRight` | string | `topRight` |
| top | Distance from the top of the viewport, when `placement` is `topRight` or `topLeft` (unit: pixels). | string | `24px` |
