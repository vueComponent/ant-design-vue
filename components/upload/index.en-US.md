## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| accept | File types that can be accepted. See [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string | - |
| action | Uploading URL | string\|(file) => `Promise` | - |
| directory | support upload whole directory ([caniuse](https://caniuse.com/#feat=input-file-directory)) | boolean | false |
| beforeUpload | Hook function which will be executed before uploading. Uploading will be stopped with `false` or a rejected Promise returned. **Warning：this function is not supported in IE9**。 | (file, fileList) => `boolean | Promise` | - |
| customRequest | override for the default xhr behavior allowing for additional customization and ability to implement your own XMLHttpRequest | Function | - |
| data | Uploading params or function which can return uploading params. | object\|function(file) | - |
| defaultFileList | Default list of files that have been uploaded. | object\[] | - |
| disabled | disable upload button | boolean | false |
| fileList | List of files that have been uploaded (controlled). Here is a common issue [#2423](https://github.com/ant-design/ant-design/issues/2423) when using it | object\[] | - |
| headers | Set request headers, valid above IE10. | object | - |
| listType | Built-in stylesheets, support for three types: `text`, `picture` or `picture-card` | string | 'text' |
| multiple | Whether to support selected multiple file. `IE10+` supported. You can select multiple files with CTRL holding down while multiple is set to be true | boolean | false |
| name | The name of uploading file | string | 'file' |
| showUploadList | Whether to show default upload list, could be an object to specify `showPreviewIcon` and `showRemoveIcon` individually | Boolean or { showPreviewIcon?: boolean, showRemoveIcon?: boolean } | true |
| supportServerRender | Need to be turned on while the server side is rendering. | boolean | false |
| withCredentials | ajax upload with cookie sent | boolean | false |
| openFileDialogOnClick | click open file dialog | boolean | true |
| remove | A callback function, will be executed when removing file button is clicked, remove event will be prevented when return value is `false` or a Promise which resolve(false) or reject. | Function(file): `boolean | Promise` | - |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | A callback function, can be executed when uploading state is changing. See [change](#change) | Function | - |
| preview | A callback function, will be executed when file link or preview icon is clicked. | Function(file) | - |
| reject | A callback function, will be executed when drop files is not accept. | Function(fileList) | - |

### change

> The function will be called when uploading is in progress, completed or failed

When uploading state change, it returns:

```js
{
  file: { /* ... */ },
  fileList: [ /* ... */ ],
  event: { /* ... */ },
}
```

1. `file` File object for the current operation.

   ```js
   {
      uid: 'uid',   // unique identifier, negative is recommend, to prevent interference with internal generated id
      name: 'xx.png'   // file name
      status: 'done', // options：uploading, done, error, removed
      response: '{"status": "success"}', // response from server
      linkProps: '{"download": "image"}', // additional html props of file link
   }
   ```

2. `fileList` current list of files
3. `event` response from server, including uploading progress, supported by advanced browsers.
