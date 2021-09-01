<docs>
---
order: 5
title: 
  zh-CN: 动态
  en-US: Dynamic
---

## zh-CN

展示动态变化的效果。

## en-US
  
The count will be animated as it changes.
</docs>

<template>
  <div>
    <a-badge :count="count">
      <a href="#" class="head-example" />
    </a-badge>
    <a-button-group>
      <a-button @click="decline">
        <minus-outlined />
      </a-button>
      <a-button @click="increase">
        <plus-outlined />
      </a-button>
    </a-button-group>
  </div>
  <div style="margin-top: 10px">
    <a-badge :dot="show">
      <a href="#" class="head-example" />
    </a-badge>
    <a-switch v-model:checked="show" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    MinusOutlined,
    PlusOutlined,
  },
  setup() {
    const count = ref<number>(5);
    const decline = () => {
      if (count.value >= 1) {
        count.value--;
      }
    };

    const increase = () => {
      count.value++;
    };
    return {
      count,
      show: ref<boolean>(true),
      decline,
      increase,
    };
  },
});
</script>
