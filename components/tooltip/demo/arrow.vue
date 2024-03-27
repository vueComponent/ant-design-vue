<docs>
---
order: 6
title:
  zh-CN: 箭头展示
  en-US: Arrow show
---

## zh-CN
支持显示、隐藏以及将箭头保持居中定位。

## en-US

Support show, hide or keep arrow in the center.
</docs>

<template>
  <div id="components-a-tooltip-demo-placement">
    <div>
      <a-radio-group v-model:value="mergeArrow" button-style="solid">
        <a-radio :value="true">show</a-radio>
        <a-radio :value="false">hidden</a-radio>
        <a-radio :value="{ pointAtCenter: 'center' }">center</a-radio>
      </a-radio-group>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <a-tooltip placement="topLeft" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>TL</a-button>
      </a-tooltip>
      <a-tooltip placement="top" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>Top</a-button>
      </a-tooltip>
      <a-tooltip placement="topRight" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>TR</a-button>
      </a-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <a-tooltip placement="leftTop" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>LT</a-button>
      </a-tooltip>
      <a-tooltip placement="left" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>Left</a-button>
      </a-tooltip>
      <a-tooltip placement="leftBottom" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>LB</a-button>
      </a-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24}px` }">
      <a-tooltip placement="rightTop" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>RT</a-button>
      </a-tooltip>
      <a-tooltip placement="right" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>Right</a-button>
      </a-tooltip>
      <a-tooltip placement="rightBottom" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>RB</a-button>
      </a-tooltip>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <a-tooltip placement="bottomLeft" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>BL</a-button>
      </a-tooltip>
      <a-tooltip placement="bottom" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>Bottom</a-button>
      </a-tooltip>
      <a-tooltip placement="bottomRight" :arrow="mergeArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <a-button>BR</a-button>
      </a-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const buttonWidth = 70;

const mergeArrow = ref(true);
</script>
<style scoped>
:deep(#components-a-tooltip-demo-placement) .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
