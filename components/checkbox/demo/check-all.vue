<docs>
---
order: 1
title:
  zh-CN: 全选
  en-US: Check all
---

## zh-CN

在实现全选效果时，你可能会用到 `indeterminate` 属性

## en-US

The `indeterminate` property can help you to achieve a 'check all' effect.

</docs>

<template>
  <div :style="{ borderBottom: '1px solid #E9E9E9' }">
    <a-checkbox
      v-model:checked="checkAll"
      :indeterminate="indeterminate"
      @change="onCheckAllChange"
    >
      Check all
    </a-checkbox>
  </div>
  <br />
  <a-checkbox-group v-model:value="checkedList" :options="plainOptions" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
const plainOptions = ['Apple', 'Pear', 'Orange'];
export default defineComponent({
  setup() {
    const state = reactive({
      indeterminate: true,
      checkAll: false,
      checkedList: ['Apple', 'Orange'],
    });

    const onCheckAllChange = (e: any) => {
      Object.assign(state, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
      });
    };
    watch(
      () => state.checkedList,
      val => {
        state.indeterminate = !!val.length && val.length < plainOptions.length;
        state.checkAll = val.length === plainOptions.length;
      },
    );

    return {
      ...toRefs(state),
      plainOptions,
      onCheckAllChange,
    };
  },
});
</script>
