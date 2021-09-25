<docs>
---
order: 2
title:
  zh-CN: 间距大小
  en-US: Space Size
---

## zh-CN

间距预设大、中、小三种大小。
通过设置 `size` 为 `large` `middle` 分别把间距设为大、中间距。若不设置 `size`，则间距为小。


## en-US

`large`, `middle` and `small` preset sizes.
Set the size to `large` and `middle` by setting size to large and middle respectively. If `size` is not set, the spacing is `small`.

</docs>

<template>
  <div>
    <a-radio-group v-model:value="size">
      <a-radio value="small">Small</a-radio>
      <a-radio value="middle">Middle</a-radio>
      <a-radio value="large">Large</a-radio>
    </a-radio-group>
    <br />
    <br />
    <a-space :size="size">
      <a-button type="primary">Primary</a-button>
      <a-button>Default</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="link">Link</a-button>
    </a-space>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      size: ref('small'),
    };
  },
});
</script>
