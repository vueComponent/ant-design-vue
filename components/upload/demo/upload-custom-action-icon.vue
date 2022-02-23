<docs>
---
order: 12
title:
  zh-CN: 自定义交互图标
  en-US: custom action icon
---

## zh-CN

使用相应插槽设置列表交互图标。

## en-US

Use slot for custom action icons of files.
</docs>

<template>
  <a-upload
    v-model:file-list="fileList"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :show-upload-list="{ showDownloadIcon: true, showRemoveIcon: true }"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      Upload
    </a-button>
    <template #downloadIcon>download</template>
    <template #removeIcon><StarOutlined @click="handleClick"></StarOutlined></template>
  </a-upload>
</template>
<script lang="ts">
import { UploadOutlined, StarOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

export default defineComponent({
  components: {
    UploadOutlined,
    StarOutlined,
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
      handleClick: (e: MouseEvent) => {
        console.log(e, 'custom removeIcon event');
      },
    };
  },
});
</script>
