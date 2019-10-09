<cn>
#### 拖拽上传
把文件拖入指定区域，完成上传，同样支持点击上传。
设置 `multiple` 后，在 `IE10+` 可以一次上传多个文件。
</cn>

<us>
#### Drag and Drop
Classic mode. File selection dialog pops up when upload button is clicked.
</us>

```tpl
<template>
  <a-upload-dragger
    name="file"
    :multiple="true"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    @change="handleChange"
  >
    <p class="ant-upload-drag-icon">
      <a-icon type="inbox" />
    </p>
    <p class="ant-upload-text">Click or drag file to this area to upload</p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </a-upload-dragger>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {
      handleChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
    },
  };
</script>
```
