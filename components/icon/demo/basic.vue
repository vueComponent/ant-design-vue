<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic
---

## zh-CN

通过 `@ant-design/icons-vue` 引用 Icon 组件，不同主题的 Icon 组件名为图标名加主题做为后缀，也可以通过设置 `spin` 属性来实现动画旋转效果。

## en-US

Import icons from `@ant-design/icons-vue`, component name of icons with different theme is the icon name suffixed by the theme name. Specific the `spin` property to show spinning animation.

</docs>

<template>
  <div class="icons-list">
    <HomeOutlined />
    <SettingFilled />
    <SmileOutlined />
    <SyncOutlined spin />
    <SmileOutlined :rotate="180" />
    <LoadingOutlined />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    HomeOutlined,
    SettingFilled,
    SmileOutlined,
    SyncOutlined,
    LoadingOutlined,
  },
});
</script>
<style scoped>
.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>
