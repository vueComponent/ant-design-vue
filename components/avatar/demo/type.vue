<docs>
---
order: 1
title:
  zh-CN: 类型
  en-US: Type
---

## zh-CN

支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。

## en-US

Image, Icon and letter are supported, and the latter two kinds avatar can have custom colors and background colors.
</docs>

<template>
  <a-avatar>
    <template #icon>
      <UserOutlined />
    </template>
  </a-avatar>
  <a-avatar>U</a-avatar>
  <a-avatar>USER</a-avatar>
  <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
  <a-avatar style="color: #f56a00; background-color: #fde3cf">U</a-avatar>
  <a-avatar style="background-color: #87d068">
    <template #icon>
      <UserOutlined />
    </template>
  </a-avatar>
</template>

<script lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    UserOutlined,
  },
});
</script>
