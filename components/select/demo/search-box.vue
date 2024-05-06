<docs>
---
order: 8
title:
  zh-CN: 搜索框
  en-US: Search Box
---

## zh-CN

搜索和远程数据结合。

## en-US

Search with remote data.

</docs>

<template>
  <a-select
    v-model:value="value"
    show-search
    placeholder="input search text"
    style="width: 200px"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    :options="data"
    @search="handleSearch"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import jsonp from 'fetch-jsonp';

let timeout: any;
let currentValue = '';

function fetch(value: string, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const params = new URLSearchParams({
      code: 'utf-8',
      q: value,
    });
    jsonp(`https://suggest.taobao.com/sug?${params}`)
      .then(response => response.json())
      .then(d => {
        if (currentValue === value) {
          const result = d.result;
          const data: any[] = [];
          result.forEach((r: any) => {
            data.push({
              value: r[0],
              label: r[0],
            });
          });
          callback(data);
        }
      });
  }

  timeout = setTimeout(fake, 300);
}

const data = ref<any[]>([]);
const value = ref();

const handleSearch = (val: string) => {
  fetch(val, (d: any[]) => (data.value = d));
};
const handleChange = (val: string) => {
  console.log(val);
  value.value = val;
  fetch(val, (d: any[]) => (data.value = d));
};
</script>
