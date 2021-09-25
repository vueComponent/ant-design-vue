<docs>
---
order: 2
title:
  zh-CN: 位置
  en-US: Placement
---

## zh-CN

位置有十二个方向。

## en-US

There are 12 `placement` options available.

</docs>
<template>
  <div id="components-popover-demo-placement">
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <a-popover placement="topLeft">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>TL</a-button>
      </a-popover>
      <a-popover placement="top">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>Top</a-button>
      </a-popover>
      <a-popover placement="topRight">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>TR</a-button>
      </a-popover>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <a-popover placement="leftTop">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>LT</a-button>
      </a-popover>
      <a-popover placement="left">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>Left</a-button>
      </a-popover>
      <a-popover placement="leftBottom">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>LB</a-button>
      </a-popover>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24}px` }">
      <a-popover placement="rightTop">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>RT</a-button>
      </a-popover>
      <a-popover placement="right">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>Right</a-button>
      </a-popover>
      <a-popover placement="rightBottom">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>RB</a-button>
      </a-popover>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <a-popover placement="bottomLeft">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>BL</a-button>
      </a-popover>
      <a-popover placement="bottom">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>Bottom</a-button>
      </a-popover>
      <a-popover placement="bottomRight">
        <template #content>
          <p>Content</p>
          <p>Content</p>
        </template>
        <template #title>
          <span>Title</span>
        </template>
        <a-button>BR</a-button>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      buttonWidth: ref<number>(70),
    };
  },
});
</script>
<style>
#components-popover-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
