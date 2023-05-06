<docs>
---
order: 8
title:
  zh-CN: 大小
  en-US: Size
---

## zh-CN

大中小三种组合，可以和表单输入框进行对应配合。

## en-US

There are three sizes available: large, medium, and small. It can coordinate with input box.

</docs>
<template>
  <div>
    <div>
      <a-radio-group v-model:value="value1" size="large">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <a-radio-group v-model:value="value2">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <a-radio-group v-model:value="value3" size="small">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const value1 = ref<string>('a');
const value2 = ref<string>('a');
const value3 = ref<string>('a');
</script>
