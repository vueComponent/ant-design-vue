<template>
  <demo-sort>
    <basic />
    <horizontal />
    <static />
    <on-click />
    <customize-highlight />
    <target-offset />
    <on-change />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Static from './static.vue';
import OnClick from './onClick.vue';
import CustomizeHighlight from './customizeHighlight.vue';
import TargetOffset from './targetOffset.vue';
import OnChange from './onChange.vue';
import Horizontal from './horizontal.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Static,
    OnClick,
    CustomizeHighlight,
    TargetOffset,
    Horizontal,
    OnChange,
  },
  setup() {
    return {};
  },
});
</script>
