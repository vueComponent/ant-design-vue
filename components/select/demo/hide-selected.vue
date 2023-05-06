<docs>
---
order: 12
title:
  zh-CN: 隐藏已选择选项
  en-US: Hide Already Selected
---

## zh-CN

隐藏下拉列表中已选择的选项。

## en-US

Hide already selected options in the dropdown.

</docs>

<template>
  <a-select
    v-model:value="selectedItems"
    mode="multiple"
    placeholder="Inserted are removed"
    style="width: 100%"
    :options="filteredOptions.map(item => ({ value: item }))"
  ></a-select>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
const selectedItems = ref<string[]>([]);

const filteredOptions = computed(() => OPTIONS.filter(o => !selectedItems.value.includes(o)));
</script>
