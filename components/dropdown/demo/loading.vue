<docs>
---
order: 9
title:
  zh-CN: 加载中状态
  en-US: Loading
---

## zh-CN

添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。

## en-US

A loading indicator can be added to a button by setting the `loading` property on the `a-dropdown-button`.


</docs>

<template>
  <a-space direction="vertical">
    <a-dropdown-button type="primary" loading>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">Submit and continue</a-menu-item>
        </a-menu>
      </template>
      Submit
    </a-dropdown-button>
    <a-dropdown-button type="primary" size="small" loading>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">Submit and continue</a-menu-item>
        </a-menu>
      </template>
      Submit
    </a-dropdown-button>
    <a-dropdown-button type="primary" :loading="loading1" @click="enterLoading1">
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">Submit and continue</a-menu-item>
        </a-menu>
      </template>
      Submit
    </a-dropdown-button>
    <a-dropdown-button :loading="loading2" @click="enterLoading2">
      Submit
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">Submit and continue</a-menu-item>
        </a-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
  </a-space>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
const loading1 = ref(false);
const loading2 = ref(false);
const enterLoading = (loading: Ref<boolean>) => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 6000);
};
function enterLoading1() {
  enterLoading(loading1);
}
function enterLoading2() {
  enterLoading(loading2);
}
</script>
