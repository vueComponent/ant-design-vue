<docs>
---
order: 6
title:
  zh-CN: 联动
  en-US: Coordinate
---

## zh-CN

省市联动是典型的例子。
推荐使用 [Cascader](/components/cascader-cn/) 组件。

## en-US

Coordinating the selection of provinces and cities is a common use case and demonstrates how selection can be coordinated.
Using the [Cascader](/components/cascader) component is strongly recommended instead as it is more flexible and capable.

</docs>

<template>
  <a-space>
    <a-select
      v-model:value="province"
      style="width: 120px"
      :options="provinceData.map(pro => ({ value: pro }))"
    ></a-select>
    <a-select
      v-model:value="secondCity"
      style="width: 120px"
      :options="cities.map(city => ({ value: city }))"
    ></a-select>
  </a-space>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};
const province = ref(provinceData[0]);
const secondCity = ref(cityData[province.value][0]);
const cities = computed(() => {
  return cityData[province.value];
});

watch(province, val => {
  secondCity.value = cityData[val][0];
});
</script>
