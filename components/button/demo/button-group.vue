<docs>
---
order: 99
title:
  zh-CN: 废弃的 Block 组
  en-US: Deprecated Button Group
debug: true
---

## zh-CN

Debug usage

## en-US

Debug usage
</docs>

<template>
  <div id="components-button-demo-button-group">
    <h4>Basic</h4>
    <a-button-group>
      <a-button>Cancel</a-button>
      <a-button type="primary">OK</a-button>
    </a-button-group>
    <a-button-group>
      <a-button disabled>L</a-button>
      <a-button disabled>M</a-button>
      <a-button disabled>R</a-button>
    </a-button-group>
    <a-button-group>
      <a-button type="primary">L</a-button>
      <a-button>M</a-button>
      <a-button>M</a-button>
      <a-button type="dashed">R</a-button>
    </a-button-group>

    <h4>With Icon</h4>
    <a-button-group>
      <a-button type="primary">
        <LeftOutlined />
        Go back
      </a-button>
      <a-button type="primary">
        Go forward
        <RightOutlined />
      </a-button>
    </a-button-group>
    <a-button-group>
      <a-button type="primary">
        <template #icon><CloudOutlined /></template>
      </a-button>
      <a-button type="primary">
        <template #icon><CloudDownloadOutlined /></template>
      </a-button>
    </a-button-group>
  </div>
</template>
<script lang="ts">
import {
  LeftOutlined,
  RightOutlined,
  CloudDownloadOutlined,
  CloudOutlined,
} from '@ant-design/icons-vue';
export default {
  components: {
    LeftOutlined,
    RightOutlined,
    CloudDownloadOutlined,
    CloudOutlined,
  },
};
</script>
<style>
#components-button-demo-button-group > h4 {
  margin: 16px 0;
  font-size: 14px;
  line-height: 1;
  font-weight: normal;
}
#components-button-demo-button-group > h4:first-child {
  margin-top: 0;
}
#components-button-demo-button-group .ant-btn-group {
  margin-right: 8px;
}
</style>
```
