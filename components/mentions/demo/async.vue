<docs>
---
order: 1
title:
  zh-CN: 异步加载
  en-US: Asynchronous loading
---

## zh-CN

匹配内容列表为异步返回时。

## en-US

async.

</docs>
<template>
  <a-mentions v-model:value="value" :options="options" :loading="loading" @search="onSearch">
    <template #option="{ payload }">
      <img :src="payload.avatar_url" :alt="payload.login" />
      <span>{{ payload.login }}</span>
    </template>
  </a-mentions>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es';
import { computed, ref } from 'vue';
import { MentionsProps } from '..';
const value = ref<string>('');
const loading = ref<boolean>(false);
const users = ref<{ login: string; avatar_url: string }[]>([]);
const search = ref<string>('');
const loadGithubUsers = debounce((key: string) => {
  if (!key) {
    users.value = [];
    return;
  }

  fetch(`https://api.github.com/search/users?q=${key}`)
    .then(res => res.json())
    .then(({ items = [] }) => {
      if (search.value !== key) return;
      users.value = items.slice(0, 10);
      loading.value = false;
    });
}, 800);

const onSearch = (searchValue: string) => {
  search.value = searchValue;
  loading.value = !!searchValue;
  console.log(!!searchValue);
  users.value = [];
  console.log('Search:', searchValue);
  loadGithubUsers(searchValue);
};
const options = computed<MentionsProps['options']>(() =>
  users.value.map(user => ({
    key: user.login,
    value: user.login,
    class: 'antd-demo-dynamic-option',
    payload: user,
  })),
);
</script>
<style scoped>
.antd-demo-dynamic-option img {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>
