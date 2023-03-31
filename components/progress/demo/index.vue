<template>
  <demo-sort>
    <line-demo />
    <circle-demo />
    <line-mini />
    <circle-mini />
    <circle-micro />
    <dynamic />
    <circle-dynamic />
    <format />
    <dashboard />
    <segment />
    <line-cap />
    <gradient-line />
    <steps />
    <Size />
  </demo-sort>
</template>
<script lang="ts">
import Line from './line.vue';
import Circle from './circle.vue';
import LineMini from './line-mini.vue';
import CircleMini from './circle-mini.vue';
import Dynamic from './dynamic.vue';
import CircleDynamic from './circle-dynamic.vue';
import Format from './format.vue';
import Dashboard from './dashboard.vue';
import Segment from './segment.vue';
import LineCap from './linecap.vue';
import GradientLine from './gradient-line.vue';
import Steps from './steps.vue';
import CircleMicro from './circle-micro.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
import Size from './size.vue';

export default defineComponent({
  CN,
  US,
  components: {
    LineDemo: Line,
    CircleDemo: Circle,
    LineMini,
    CircleMini,
    Dynamic,
    CircleDynamic,
    Format,
    Dashboard,
    Segment,
    LineCap,
    GradientLine,
    Steps,
    CircleMicro,
    Size,
  },
  setup() {
    return {};
  },
});
</script>
<style>
[id^='components-progress-demo-'] .ant-progress {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
