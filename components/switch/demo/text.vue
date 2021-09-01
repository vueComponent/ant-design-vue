<docs>
---
order: 2
title:
  zh-CN: 文字和图标
  en-US: Text & icon
---

## zh-CN

带有文字和图标。

## en-US

With text and icon.

</docs>

<template>
  <div>
    <a-switch checked-children="开" un-checked-children="关" v-model:checked="checked1" />
    <br />
    <a-switch checked-children="1" un-checked-children="0" v-model:checked="checked2" />
    <br />
    <a-switch v-model:checked="checked3">
      <template #checkedChildren><check-outlined /></template>
      <template #unCheckedChildren><close-outlined /></template>
    </a-switch>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  setup() {
    const state = reactive({
      checked1: true,
      checked2: false,
      checked3: false,
    });
    return { ...toRefs(state) };
  },

  components: {
    CheckOutlined,
    CloseOutlined,
  },
});
</script>
