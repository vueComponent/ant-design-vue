<cn>
#### 用户头像
点击上传用户头像，并使用 `beforeUpload` 限制用户上传的图片格式和大小。
`beforeUpload` 的返回值可以是一个 Promise 以支持异步处理，如服务端校验等
</cn>

<us>
#### Avatar
Click to upload user's avatar, and validate size and format of picture with `beforeUpload`.
The return value of function `beforeUpload` can be a Promise to check asynchronously.
</us>

```tpl
<template>
  <a-upload
    name="avatar"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :beforeUpload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
    <div v-else>
      <a-icon :type="loading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>
<script>
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  export default {
    data() {
      return {
        loading: false,
        imageUrl: '',
      };
    },
    methods: {
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => {
            this.imageUrl = imageUrl;
            this.loading = false;
          });
        }
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
      },
    },
  };
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
```
