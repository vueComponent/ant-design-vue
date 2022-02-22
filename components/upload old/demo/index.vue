<template>
  <demo-sort>
    <Basic />
    <Avatar />
    <DefaultFileList />
    <PictureCard />
    <FileList />
    <Drag />
    <PictureStyle />
    <UploadManually />
    <Directory />
    <PreviewFile />
    <TransformFile />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Avatar from './avatar.vue';
import DefaultFileList from './defaultFileList.vue';
import PictureCard from './picture-card.vue';
import FileList from './fileList.vue';
import Drag from './drag.vue';
import PictureStyle from './picture-style.vue';
import UploadManually from './upload-manually.vue';
import Directory from './directory.vue';
import PreviewFile from './preview-file.vue';
import TransformFile from './transform-file.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Avatar,
    DefaultFileList,
    PictureCard,
    FileList,
    Drag,
    PictureStyle,
    UploadManually,
    Directory,
    PreviewFile,
    TransformFile,
  },
  setup() {
    return {};
  },
});
</script>
