<docs>
---
order: 9
title:
  zh-CN: 自定义预览
  en-US: Customize preview file
---

## zh-CN

自定义本地预览，用于处理非图片格式文件（例如视频文件）。

## en-US

Customize local preview. Can handle with non-image format files such as video.
</docs>

<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture"
      action="//jsonplaceholder.typicode.com/posts/"
      :preview-file="previewFile"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Upload
      </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const previewFile = async (file: any): Promise<Response> => {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
      const res = await fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
        method: 'POST',
        body: file,
      });
      const { thumbnail } = await res.json();
      return thumbnail;
    };
    return {
      previewFile,
      fileList: ref([]),
    };
  },
});
</script>
