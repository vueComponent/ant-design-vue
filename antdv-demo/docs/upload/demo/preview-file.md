<cn>
#### 自定义预览
自定义本地预览，用于处理非图片格式文件（例如视频文件）。
</cn>

<us>
#### Customize preview file
Customize local preview. Can handle with non-image format files such as video.
</us>

```vue
<template>
  <div>
    <a-upload
      list-type="picture"
      action="//jsonplaceholder.typicode.com/posts/"
      :preview-file="previewFile"
    >
      <a-button> <a-icon type="upload" /> Upload </a-button>
    </a-upload>
  </div>
</template>
<script>
export default {
  methods: {
    previewFile(file) {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
      return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
        method: 'POST',
        body: file,
      })
        .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  },
};
</script>
```
