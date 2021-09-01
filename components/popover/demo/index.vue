<template>
  <demo-sort>
    <basic />
    <trigger-type />
    <placement />
    <control />
    <arrow-center />
    <hover-with-click />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import ArrowCenter from './arrow-point-at-center.vue';
import Control from './control.vue';
import Placement from './placement.vue';
import TriggerType from './triggerType.vue';
import HoverWithClick from './hover-with-click.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    TriggerType,
    Placement,
    Control,
    ArrowCenter,
    HoverWithClick,
  },
});
</script>
