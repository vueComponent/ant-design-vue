<docs>
---
order: 7
iframe: 360
title:
  zh-CN: 回到顶部
  en-US: BackTop
---
  
## zh-CN

返回页面顶部的操作按钮。

## en-US

`BackTop` makes it easy to go back to the top of the page.

</docs>

<template>
  <div :style="{ height: '500vh', padding: '10px' }">
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <a-back-top />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileTextOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: { FileTextOutlined },
  setup() {
    return {};
  },
});
</script>
