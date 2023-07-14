<docs>
---
order: 10
title:
  zh-CN: 搜索用户
  en-US: Search and Select Users
---

## zh-CN

一个带有远程搜索，节流控制，请求时序控制，加载状态的多选示例。

## en-US

A complete multiple select sample with remote search, debounce fetch, ajax callback order flow, and loading state.

</docs>

<template>
  <a-select
    v-model:value="state.value"
    mode="multiple"
    label-in-value
    placeholder="Select users"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="state.fetching ? undefined : null"
    :options="state.data"
    @search="fetchUser"
  >
    <template v-if="state.fetching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { debounce } from 'lodash-es';
let lastFetchId = 0;

const state = reactive({
  data: [],
  value: [],
  fetching: false,
});

const fetchUser = debounce(value => {
  console.log('fetching user', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;
  fetch('https://randomuser.me/api/?results=5')
    .then(response => response.json())
    .then(body => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }
      const data = body.results.map(user => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }));
      state.data = data;
      state.fetching = false;
    });
}, 300);

watch(state.value, () => {
  state.data = [];
  state.fetching = false;
});
</script>
