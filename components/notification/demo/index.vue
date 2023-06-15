<template>
  <demo-sort>
    <hook />
    <basic />
    <duratioin />
    <with-icon />
    <custom-icon />
    <with-btn />
    <custom-style />
    <placement />
    <update />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Hook from './hook.vue';
import Duratioin from './duration.vue';
import WithIcon from './with-icon.vue';
import CustomIcon from './custom-icon.vue';
import WithBtn from './with-btn.vue';
import CustomStyle from './custom-style.vue';
import Placement from './placement.vue';
import Update from './update.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Duratioin,
    WithIcon,
    CustomIcon,
    WithBtn,
    CustomStyle,
    Placement,
    Update,
    Hook,
  },
  setup() {
    return {};
  },
});
</script>
<style>
[id^='components-notification-demo-'] .ant-btn {
  margin-right: 8px;
}
</style>
