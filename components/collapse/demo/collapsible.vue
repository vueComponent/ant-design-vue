<docs>
---
order: 7
title:
  zh-CN: 可折叠触发区域
  en-US: Collapsible
---
  
## zh-CN
  
通过 `collapsible` 属性，可以设置面板的可折叠触发区域。
  
## en-US
  
Specify the trigger area of collapsible by `collapsible`.
  
</docs>

<template>
  <a-space direction="vertical">
    <a-collapse collapsible="header" v-model:activeKey="activeKey">
      <a-collapse-panel header="This panel can only be collapsed by clicking text" key="1">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse collapsible="icon" v-model:activeKey="activeKey">
      <a-collapse-panel header="This panel can only be collapsed by clicking icon" key="1">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse collapsible="disabled">
      <a-collapse-panel header="This panel can't be collapsed" key="1">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const activeKey = ref(['1']);
    const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;
    return {
      activeKey,
      text,
    };
  },
});
</script>
<style>
.ant-space {
  width: 100%;
}
</style>
