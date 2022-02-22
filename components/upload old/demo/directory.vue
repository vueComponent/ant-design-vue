<docs>
---
order: 8
title:
  zh-CN: 文件夹上传
  en-US: Upload directory
---

## zh-CN

支持上传一个文件夹里的所有文件。

## en-US

You can select and upload a whole directory.
</docs>

<template>
  <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" directory>
    <a-button>
      <upload-outlined></upload-outlined>
      Upload Directory
    </a-button>
  </a-upload>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    UploadOutlined,
  },
});
</script>
