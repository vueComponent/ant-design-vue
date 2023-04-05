<docs>
---
order: 2
title:
  zh-CN: 带图标的步骤条
  en-US: With icon
---

## zh-CN

通过设置 `Steps.Step` 的 `icon` 属性，可以启用自定义图标。

## en-US

You can use your own custom icons by setting the property `icon` for `Steps.Step`.
</docs>
<template>
  <a-steps :items="items"></a-steps>
</template>
<script lang="ts">
import { defineComponent, ref, h } from 'vue';
import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { StepProps } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const current = ref<number>(0);

    return {
      current,
      items: [
        {
          title: 'Login',
          status: 'finish',
          icon: h(UserOutlined),
        },
        {
          title: 'Verification',
          status: 'finish',
          icon: h(SolutionOutlined),
        },
        {
          title: 'Pay',
          status: 'process',
          icon: h(LoadingOutlined),
        },
        {
          title: 'Done',
          status: 'wait',
          icon: h(SmileOutlined),
        },
      ] as StepProps[],
    };
  },
});
</script>
