---
category: Components
type: Data Entry
title: Upload
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*93ymR4RD4S0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*l1nlSryXib8AAAAAAAAAAAAADrJ8AQ/original
---

Upload file by selecting or dragging.

## When To Use

Uploading is the process of publishing information (web pages, text, pictures, video, etc.) to a remote server via a web page or upload tool.

- When you need to upload one or more files.
- When you need to show the process of uploading.
- When you need to upload files by dragging and dropping.

## API

| Property | Description | Type | Default | Version |  |
| --- | --- | --- | --- | --- | --- |
| accept | File types that can be accepted. See [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string | - |  |  |
| action | Uploading URL | string\|(file) => `Promise` | - |  |  |
| beforeUpload | Hook function which will be executed before uploading. Uploading will be stopped with `false` or a rejected Promise returned. | (file, fileList) => `boolean` \| `Promise` | - |  |
| customRequest | override for the default xhr behavior allowing for additional customization and ability to implement your own XMLHttpRequest | function | - |  |  |
| data | Uploading params or function which can return uploading params. | object\|function(file) | - |  |  |
| directory | Support upload whole directory（[caniuse](https://caniuse.com/#feat=input-file-directory)） | boolean | false | 3.0 |  |
| disabled | disable upload button | boolean | - |  |  |
| downloadIcon | custom download icon | v-slot:iconRender="{file: UploadFile}" | - | 3.0 |  |
| fileList | List of files that have been uploaded (controlled). Here is a common issue [#2423](https://github.com/ant-design/ant-design/issues/2423) when using it | object\[] | - |  |  |
| headers | Set request headers, valid above IE10. | object | - |  |  |
| iconRender | Custom show icon | v-slot:iconRender="{file: UploadFile, listType?: UploadListType}" | - | 3.0 |  |
| isImageUrl | Customize if render &lt;img /> in thumbnail | (file: UploadFile) => boolean | - | 3.0 |  |
| itemRender | Custom item of uploadList | v-slot:itemRender="{originNode: VNode, file: UploadFile, fileList: object\[], actions: { download: function, preview: function, remove: function }" | - | 3.0 |  |
| listType | Built-in stylesheets, support for three types: `text`, `picture` or `picture-card` | string | `text` |  |  |
| maxCount | Limit the number of uploaded files. Will replace current one when `maxCount` is `1` | number | - | 3.0 |  |
| method | http method of upload request | string | `post` | 1.5.0 |  |
| multiple | Whether to support selected multiple file. `IE10+` supported. You can select multiple files with CTRL holding down while multiple is set to be true | boolean | false |  |  |
| name | The name of uploading file | string | `file` |  |  |
| openFileDialogOnClick | Click open file dialog | boolean | true | 3.0 |  |
| previewFile | Customize preview file logic | (file: File \| Blob) => Promise&lt;dataURL: string> | - | 1.5.0 |  |
| previewIcon | custom preview icon | v-slot:iconRender="{file: UploadFile}" | - | 3.0 |  |
| progress | Custom progress bar | [ProgressProps](/components/progress/#api) (support `type="line"` only) | { strokeWidth: 2, showInfo: false } | 3.0 |  |
| removeIcon | custom remove icon | v-slot:iconRender="{file: UploadFile}" | - | 3.0 |  |
| showUploadList | Whether to show default upload list, could be an object to specify `showPreviewIcon`, `showRemoveIcon` and `showDownloadIcon` individually | boolean \| { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean } | true | showDownloadIcon(3.0) |  |
| supportServerRender | Need to be turned on while the server side is rendering. | boolean | false |  |  |
| withCredentials | ajax upload with cookie sent | boolean | false |  |  |

### events

| Events Name | Description | Arguments | Version |  |
| --- | --- | --- | --- | --- |
| change | A callback function, can be executed when uploading state is changing. See [change](#change) | function | - |  |
| download | Click the method to download the file, pass the method to perform the method logic, do not pass the default jump to the new TAB. | function(file): void | Jump to new TAB | 1.5.0 |
| drop | A callback function executed when files are dragged and dropped into upload area | (event: DragEvent) => void | - | 3.0 |
| preview | A callback function, will be executed when file link or preview icon is clicked. | function(file) | - |  |
| reject | A callback function, will be executed when drop files is not accept. | function(fileList) | - |  |
| remove   | A callback function, will be executed when removing file button is clicked, remove event will be prevented when return value is false or a Promise which resolve(false) or reject | function(file): boolean \| Promise | -   | 3.0 |

### UploadFile

Extends File with additional props.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| crossOrigin | CORS settings attributes | `'anonymous'` \| `'use-credentials'` \| `''` | - | 3.3.0 |
| name | File name | string | - |  |
| percent | Upload progress percent | number | - |  |
| status | Upload status. Show different style when configured | `error` \| `success` \| `done` \| `uploading` \| `removed` | - |  |
| thumbUrl | Thumb image url | string | - |  |
| uid | unique id. Will auto generate when not provided | string | - |  |
| url | Download url | string | - |  |

### change

> The function will be called when uploading is in progress, completed or failed

When uploading state change, it returns:

```jsx
{
  file: { /* ... */ },
  fileList: [ /* ... */ ],
  event: { /* ... */ },
}
```

1. `file` File object for the current operation.

   ```jsx
   {
      uid: 'uid',   // unique identifier, negative is recommend, to prevent interference with internal generated id
      name: 'xx.png',   // file name
      status: 'done', // options：uploading, done, error, removed
      response: '{"status": "success"}', // response from server
      linkProps: '{"download": "image"}', // additional html props of file link
      xhr: 'XMLHttpRequest{ ... }', // XMLHttpRequest Header
   }
   ```

2. `fileList` current list of files

3. `event` response from server, including uploading progress, supported by advanced browsers.

## FAQ

### How do I implement upload server side?

- You can consult [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload/wiki#server-side) about how to implement server side upload interface.
- There is a mock example of [express](https://github.com/react-component/upload/blob/master/server.js) in rc-upload.

### How to select albums or folders on mobile devices?

You can set `:capture="null"`

### I want to display download links.

Please set property `url` of each item in `fileList` to control content of link.

### How to use `customRequest`?

See <https://github.com/react-component/upload#customrequest>.

### Why will the `fileList` that's in control not trigger `change` `status` update when the file is not in the list?

`change` only trigger when file in the list, it will ignore left events when removed from the list. Please note that there exist bug which makes event still trigger even the file is not in the list before `3.0.0-beta.10`.

### Why does `change` sometimes return File object and other times return { originFileObj: File }?

For compatible case, we return File object when `beforeUpload` return `false`. It will merge to `{ originFileObj: File }` in next major version. Current version is compatible to get origin file by `info.file.originFileObj`. You can change this before major release.

### Why sometime Chrome can not upload?

Chrome update will also break native upload. Please restart chrome to finish the upload work. Ref:

- [#32672](https://github.com/ant-design/ant-design/issues/32672)
- [#32913](https://github.com/ant-design/ant-design/issues/32913)
- [#33988](https://github.com/ant-design/ant-design/issues/33988)
