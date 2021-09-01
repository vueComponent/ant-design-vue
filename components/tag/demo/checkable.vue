<docs>
---
order: 1
title:
  zh-CN: 可选择
  en-US: Checkable
---

## zh-CN

可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。
> 该组件为完全受控组件，不支持非受控用法。

## en-US

`CheckableTag` works like Checkbox, click it to toggle checked state.
> it is an absolute controlled component and has no uncontrolled mode.

</docs>

<template>
  <div>
    <a-checkable-tag v-model:checked="checked1" @change="handleChange">Tag1</a-checkable-tag>
    <a-checkable-tag v-model:checked="checked2" @change="handleChange">Tag2</a-checkable-tag>
    <a-checkable-tag v-model:checked="checked3" @change="handleChange">Tag3</a-checkable-tag>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    // or use watch
    const handleChange = (checked: boolean) => {
      console.log(checked);
    };

    return {
      handleChange,
      checked1: ref(false),
      checked2: ref(false),
      checked3: ref(false),
    };
  },
});
</script>
