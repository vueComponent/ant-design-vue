<docs>
---
order: 7
title:
  zh-CN: 支持更多内容配置
  en-US: Support more content configuration
---

## zh-CN

一种支持封面、头像、标题和描述信息的卡片。

## en-US

A Card that supports `cover`, `avatar`, `title` and `description`.

</docs>

<template>
  <a-card hoverable style="width: 300px">
    <template #cover>
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    </template>
    <template #actions class="ant-card-actions">
      <setting-outlined key="setting" />
      <edit-outlined key="edit" />
      <ellipsis-outlined key="ellipsis" />
    </template>
    <a-card-meta title="Card title" description="This is the description">
      <template #avatar>
        <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      </template>
    </a-card-meta>
  </a-card>
</template>

<script lang="ts">
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
  },
});
</script>
