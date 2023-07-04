<docs>
---
order: 2
title:
  zh-CN: 已上传的文件列表
  en-US: Default Files
---

## zh-CN

使用 `fileList` 设置已上传的内容。

## en-US

Use `fileList` for uploaded files when page init.
</docs>

<template>
  <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
    <a-button>
      <upload-outlined></upload-outlined>
      Upload
    </a-button>
  </a-upload>
</template>
<script lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const fileList = ref<UploadProps['fileList']>([
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
      },
      {
        uid: '2',
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      },
      {
        uid: '3',
        name: 'zzz.png',
        status: 'error',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
      },
    ]);

    const handleChange = ({ file, fileList }: UploadChangeParam) => {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    };
    return {
      fileList,
      handleChange,
    };
  },
});
</script>
